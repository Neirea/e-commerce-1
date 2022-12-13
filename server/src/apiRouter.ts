import { OrderStatus, PrismaClient, Role } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { Request, Router } from "express";
import { UploadedFile } from "express-fileupload";
import fs from "fs";
import { StatusCodes } from "http-status-codes";
import passport from "passport";
import Stripe from "stripe";
import { app } from ".";
import { Status } from "./generated/graphql";
import CustomError from "./errors/custom-error";
import { failedLogin, loginCallback } from "./passport";

interface CheckoutBody {
    items: {
        id: number;
        amount: number;
    }[];
    buyer: {
        name: string;
        email: string;
        address: string;
        phone: string;
    };
}
interface CustomRequest<T> extends Request {
    body: T;
}

const router = Router();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!, {
    apiVersion: "2022-08-01",
});
const clientUrl = process.env.CLIENT_URL!;

router.patch("/checkout/:orderId", async (req, res) => {
    const order = await prisma.order.findUnique({
        where: {
            id: +req.params.orderId,
        },
        include: {
            order_items: {
                select: {
                    id: true,
                    amount: true,
                    product: true,
                },
            },
        },
    });

    if (order == null) {
        throw new CustomError(
            "Failed to retrieve order data",
            StatusCodes.BAD_REQUEST
        );
    }
    if (req.session.user?.id !== order.user_id) {
        throw new CustomError(
            "Order does not belong to this user",
            StatusCodes.BAD_REQUEST
        );
    }

    if (order.status !== Status.PENDING) {
        throw new CustomError(
            "This order has been paid already",
            StatusCodes.BAD_REQUEST
        );
    }

    const productIds = order.order_items.map((o) => o.product.id);

    const products = await prisma.product.findMany({
        where: {
            id: { in: productIds },
        },
        select: {
            id: true,
            name: true,
            price: true,
            discount: true,
            inventory: true,
        },
    });

    const orderProducts = order.order_items.map((order) => {
        const product = products.find((p) => p.id === order.product.id);
        if (!product) {
            throw new CustomError(
                `We don't have ${order.product.name} in our inventory anymore`,
                StatusCodes.BAD_REQUEST
            );
        }
        if (product.inventory < order.amount) {
            throw new CustomError(
                `We don't have ${product.name} in this amount: ${order.amount}`,
                StatusCodes.BAD_REQUEST
            );
        }
        let price = order.product.price;
        //if pricing changed
        if (
            product.price !== order.product.price ||
            product.discount !== order.product.discount
        ) {
            price = ((100 - product.discount) / 100) * product.price;
            //update price information for single order
            prisma.singleOrderItem.update({
                where: {
                    id: order.id,
                },
                data: {
                    price: price,
                },
            });
        }
        return {
            name: order.product.name,
            price: price,
            amount: order.amount,
        };
    });

    //start payment session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",

        customer_email: order.buyer_email,
        line_items: orderProducts.map((item) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: item.price * 100, // in cents
                },
                quantity: item.amount || 0,
            };
        }),
        success_url: `${process.env.SERVER_URL}/api/payment/${order.id}?success=true`,
        cancel_url: `${process.env.SERVER_URL}/api/payment/${order.id}?success=false`,
    });

    res.json({ url: session.url });
});

router.post("/checkout", async (req: CustomRequest<CheckoutBody>, res) => {
    if (req.body.items.length === 0) {
        throw new CustomError("Your cart is empty", StatusCodes.BAD_REQUEST);
    }
    const products = await prisma.product.findMany({
        where: {
            id: {
                in: req.body.items.map((item) => item.id),
            },
        },
        select: {
            id: true,
            name: true,
            price: true,
            discount: true,
            inventory: true,
            shipping_cost: true,
        },
    });

    //products info for order
    const orderProducts = products.map((product) => {
        const productAmount = req.body.items.find(
            (p) => p.id === product.id
        )?.amount;
        if (!productAmount || productAmount > product.inventory) {
            throw new CustomError(
                `We don't have ${product.name} in this amount: ${productAmount}`,
                StatusCodes.BAD_REQUEST
            );
        }
        return {
            id: product.id,
            name: product.name,
            amount: productAmount,
            price: ((100 - product.discount) / 100) * product.price, // in dollars
        };
    });

    //create order
    const order = await prisma.order.create({
        data: {
            user_id: req.session.user?.id,
            buyer_name: req.body.buyer.name,
            buyer_email: req.body.buyer.email,
            delivery_address: req.body.buyer.address,
            buyer_phone: req.body.buyer.phone || undefined,
            shipping_cost: Math.max(...products.map((p) => p.shipping_cost)),
            order_items: {
                createMany: {
                    data: orderProducts.map((p) => {
                        return {
                            product_id: p.id,
                            amount: p.amount,
                            price: p.price,
                        };
                    }),
                },
            },
        },
    });

    //start payment session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: req.body.buyer.email,
        line_items: orderProducts.map((item) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: item.price * 100, // in cents
                },
                quantity: item.amount || 0,
            };
        }),
        success_url: `${process.env.SERVER_URL}/api/payment/${order.id}?success=true`,
        cancel_url: `${process.env.SERVER_URL}/api/payment/${order.id}?success=false`,
    });

    res.json({ url: session.url });
});
//proceed after payment
router.get("/payment/:orderId", async (req, res) => {
    const isSuccess = req.query.success === "true" ? true : false;
    const orderId = +req.params.orderId;
    if (isSuccess) {
        //update status
        const order = await prisma.order.update({
            where: {
                id: orderId,
            },
            data: {
                status: OrderStatus.ACCEPTED,
                payment_time: new Date(),
            },
            include: {
                order_items: true,
            },
        });
        // remove items from inventory
        order.order_items.forEach(async (o) => {
            await prisma.product.update({
                where: {
                    id: o.product_id,
                },
                data: {
                    inventory: {
                        decrement: o.amount,
                    },
                },
            });
        });

        res.redirect(
            `${clientUrl}/order_payment?order_id=${orderId}&success=true`
        );
    } else {
        res.redirect(
            `${clientUrl}/order_payment?order_id=${orderId}&success=false`
        );
    }
});

//auth routes
router.get("/auth/login/failed", failedLogin);
//google
router.get("/auth/login/google", (req, res, next) => {
    app.set("redirect", req.query.path);
    passport.authenticate("google", {
        session: false,
        scope: ["profile", "email"],
    })(req, res, next);
});
router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/auth/login/failed",
    }),
    loginCallback
);
//facebook
router.get("/auth/login/facebook", (req, res, next) => {
    app.set("redirect", req.query.path);
    passport.authenticate("facebook", {
        session: false,
        scope: ["email"],
    })(req, res, next);
});
router.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
        session: false,
        failureRedirect: "/auth/login/failed",
    }),
    loginCallback
);
router.delete("/auth/logout", (req, res) => {
    if (req.session) {
        //deletes from session from Redis too
        req.session.destroy((err: any) => {
            if (err) {
                return false;
            }
        });
    }

    if (process.env.NODE_ENV === "production") {
        res.clearCookie("sid", {
            sameSite: "none",
            secure: true,
        });
    } else {
        res.clearCookie("sid");
    }

    res.status(StatusCodes.OK).json({ message: "Success" });
});
router.post("/editor/upload-images", async (req, res) => {
    if (!req.session.user?.role.includes(Role.EDITOR)) {
        res.status(StatusCodes.OK).json({ message: "OK" });
        return;
    }
    interface UploadedImage {
        img_id: string;
        img_src: string;
    }
    const imageFiles = req.files?.images as Array<UploadedFile> | UploadedFile;
    if (Array.isArray(imageFiles)) {
        if (!imageFiles || !imageFiles.length) {
            res.json({ images: [] });
            return;
        }
        interface UploadedImage {
            img_id: string;
            img_src: string;
        }
        const resultImages: Array<UploadedImage> = [];

        for (let i = 0; i < imageFiles.length; i++) {
            const result = await cloudinary.uploader.upload(
                imageFiles[i].tempFilePath,
                {
                    transformation: [
                        {
                            width: 640,
                            height: 640,
                            crop: "pad",
                            fetch_format: "jpg",
                        },
                    ],
                    folder: "ecommerce-1",
                }
            );
            resultImages.push({
                img_id: result.public_id,
                img_src: result.secure_url,
            });
            fs.unlinkSync(imageFiles[i].tempFilePath);
        }
        res.status(StatusCodes.OK).json({ images: resultImages });
        return;
    } else {
        if (!imageFiles) {
            res.json({ images: [] });
            return;
        }

        const resultImages: Array<UploadedImage> = [];
        const result = await cloudinary.uploader.upload(
            imageFiles.tempFilePath,
            {
                transformation: [
                    {
                        width: 640,
                        height: 640,
                        crop: "lfill",
                        fetch_format: "jpg",
                    },
                    {
                        fetch_format: "jpg",
                    },
                ],
                folder: "ecommerce-1",
            }
        );

        resultImages.push({
            img_id: result.public_id,
            img_src: result.secure_url,
        });
        fs.unlinkSync(imageFiles.tempFilePath);
        res.status(StatusCodes.OK).json({ images: resultImages });
    }
});

export default router;
