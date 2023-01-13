import {
    Order,
    OrderStatus,
    Prisma,
    PrismaPromise,
    Product,
} from "@prisma/client";
import { Request, Router } from "express";
import { StatusCodes } from "http-status-codes";
import Stripe from "stripe";
import CustomError from "../errors/custom-error";
import { Status } from "../generated/graphql";
import addOrderToQueue from "../jobs/staleOrders";
import prisma from "../prisma";

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
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!, {
    apiVersion: "2022-11-15",
});
const clientUrl = process.env.CLIENT_URL!;

//new order
router.post("/checkout", async (req: CustomRequest<CheckoutBody>, res) => {
    if (req.body.items.length === 0) {
        throw new CustomError("Your cart is empty", StatusCodes.BAD_REQUEST);
    }
    const products = await prisma.$queryRaw<Product[]>`
        SELECT p.* FROM public."Product" as p
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
            success_url: `${process.env.SERVER_URL}/api/payment/done/${order.id}?success=true`,
            cancel_url: `${process.env.SERVER_URL}/api/payment/done/${order.id}?success=false`,
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
        success_url: `${process.env.SERVER_URL}/api/payment/done/${order.id}?success=true`,
        cancel_url: `${process.env.SERVER_URL}/api/payment/done/${order.id}?success=false`,
    });

    res.json({ url: session.url });
});

//update DB after payment
router.get("/done/:orderId", async (req, res) => {
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

        res.redirect(
            `${clientUrl}/order_payment?order_id=${orderId}&success=true`
        );
    } else {
        res.redirect(
            `${clientUrl}/order_payment?order_id=${orderId}&success=false`
        );
    }
});

export default router;
