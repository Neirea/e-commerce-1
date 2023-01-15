import {
    Order,
    OrderStatus,
    Prisma,
    PrismaPromise,
    Product,
    ProductImage,
} from "@prisma/client";
import express, { Request, Router } from "express";
import { StatusCodes } from "http-status-codes";
import Stripe from "stripe";
import CustomError from "../errors/custom-error";
import { Status } from "../generated/graphql";
import { stripe } from "../index";
import addOrderToQueue from "../jobs/staleOrders";
import prisma from "../prisma";
import { imagesJSON } from "../schema/resolvers/sql/Product";

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
const clientUrl = process.env.CLIENT_URL!;

//new order
router.post("/checkout", async (req: CustomRequest<CheckoutBody>, res) => {
    if (req.body.items.length === 0) {
        throw new CustomError("Your cart is empty", StatusCodes.BAD_REQUEST);
    }
    type ProductsType = Array<Product & { images: ProductImage[] }>;
    const products = await prisma.$queryRaw<ProductsType>`
        SELECT p.*,i.* FROM public."Product" as p
        INNER JOIN (${imagesJSON}) as i ON p.id = i.product_id
        WHERE id IN (${Prisma.join(req.body.items.map((item) => item.id))})
    `;

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
            image: product.images[0].img_src,
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
    addOrderToQueue(order.id);

    //start payment session
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            metadata: { orderId: order.id },
            customer_email: req.body.buyer.email,
            line_items: orderProducts.map((item) => {
                return {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: item.name,
                            images: [item.image],
                        },
                        unit_amount: item.price * 100, // in cents
                    },
                    quantity: item.amount || 0,
                };
            }),
            success_url: `${clientUrl}/order_payment?order_id=${order.id}&success=true`,
            cancel_url: `${clientUrl}/order_payment?order_id=${order.id}&success=false`,
        });
        res.json({ url: session.url });
    } catch (error: any) {
        await prisma.$queryRaw`
            DELETE FROM public."Order"
            WHERE id = ${order.id}
        `;
        throw new CustomError("Stripe error: Incorrect data", 400);
    }
});

//existing order
router.post("/checkout/:orderId", async (req, res) => {
    type OrderType = [
        Order & {
            order_items: {
                id: number;
                amount: number;
                order_id: number;
                product: Product;
            }[];
        }
    ];
    const orderQuery = await prisma.$queryRaw<OrderType>`
        SELECT o.*,json_agg(s.*) as order_items
        FROM public."Order" as o
        INNER JOIN
            (SELECT s.id,s.amount,s.order_id,to_json(p.*) as product
            FROM public."SingleOrderItem" as s
            INNER JOIN public."Product" as p
            ON s.product_id = p.id) as s
        ON s.order_id = o.id
        WHERE o.id = ${+req.params.orderId}
        GROUP BY o.id
    `;
    const order = orderQuery[0];

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

    const orderProducts = order.order_items.map((order) => {
        if (order.product.inventory < order.amount) {
            throw new CustomError(
                `We don't have ${order.product.name} in this amount: ${order.amount}`,
                StatusCodes.BAD_REQUEST
            );
        }
        return {
            name: order.product.name,
            price: order.product.price,
            amount: order.amount,
        };
    });

    //start payment session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        metadata: { orderId: order.id },
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
        success_url: `${clientUrl}/order_payment?order_id=${order.id}&success=true`,
        cancel_url: `${clientUrl}/order_payment?order_id=${order.id}&success=false`,
    });

    res.json({ url: session.url });
});

//update DB after payment
router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
        const sig = req.headers["stripe-signature"]!;
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                webhookSecret
            );

            if (event.type === "checkout.session.completed") {
                const orderId = (event.data.object as Stripe.Charge).metadata
                    .orderId;
                //update status
                const order = await prisma.order.update({
                    where: {
                        id: +orderId,
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
                const productUpdates: PrismaPromise<unknown>[] = [];
                order.order_items.forEach(async (o) => {
                    const update = prisma.$queryRaw`
                        UPDATE public."Product"
                        SET inventory = inventory - ${o.amount}
                        WHERE id = ${o.product_id}
                    `;
                    productUpdates.push(update);
                });
                await Promise.all(productUpdates);
            }
        } catch (err) {
            // On error, log and return the error message
            console.log(`❌ Error message: ${(err as Error).message}`);
            res.status(400).send(`Webhook Error: ${(err as Error).message}`);
            return;
        }
        // Successfully constructed event
        res.json({ received: "true" });
    }
);

export default router;
