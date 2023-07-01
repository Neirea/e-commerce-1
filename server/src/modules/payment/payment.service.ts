import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CheckoutReturnType, OrderProductsType } from "./payment.types";
import { PrismaPromise, Product, User } from "@prisma/client";
import { getProductsByIdsQuery } from "../product/product.queries";
import { stripe } from "src/common/stripe";
import {
    deleteOrderQuery,
    getOrdersByOrderIdQuery,
    updateOrderItemQuery,
} from "../order/order.queries";
import { CheckoutBodyDto } from "./dto/checkout-body.dto";
import {
    OrderId,
    OrderWithItems,
    OrderWithItemsAndImgs,
} from "../order/order.types";
import { ProductWithImages } from "../product/product.types";
import Stripe from "stripe";
import { getDiscountPrice } from "./utils/get-price";

@Injectable()
export class PaymentService {
    constructor(private prisma: PrismaService) {}

    async initializePayment(
        user: User,
        body: CheckoutBodyDto,
    ): Promise<CheckoutReturnType> {
        if (body.items.length === 0) {
            throw new BadRequestException("Your cart is empty");
        }
        const products = await this.prisma.$queryRaw<ProductWithImages[]>(
            getProductsByIdsQuery(body.items.map((i) => i.id)),
        );

        //products info for order
        const orderProducts: OrderProductsType[] = products.map((product) => {
            const orderAmount = body.items.find(
                (p) => p.id === product.id,
            )?.amount;
            this.checkInventoryAmount(product, orderAmount);
            return {
                id: product.id,
                name: product.name,
                amount: orderAmount,
                image: product.images[0].img_src,
                price: getDiscountPrice(product.price, product.discount), // in dollars
            };
        });
        const shippingConst = Math.max(...products.map((p) => p.shipping_cost));
        //create order
        const order = await this.prisma.order.create({
            data: {
                user_id: user?.id,
                buyer_name: body.buyer.name,
                buyer_email: body.buyer.email,
                delivery_address: body.buyer.address,
                buyer_phone: body.buyer.phone || undefined,
                shipping_cost: shippingConst,
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
        try {
            const session = await this.createStripeSession(
                body.buyer.email,
                order.id,
                order.shipping_cost,
                orderProducts,
            );
            return { url: session.url };
        } catch (error: any) {
            await this.prisma.$queryRaw(deleteOrderQuery(order.id));
            throw new BadRequestException("Stripe error: Incorrect data");
        }
    }

    async resumePayment(user: User, id: OrderId): Promise<CheckoutReturnType> {
        const orderQuery = await this.prisma.$queryRaw<[OrderWithItemsAndImgs]>(
            getOrdersByOrderIdQuery(id),
        );
        const order = orderQuery[0];

        this.checkOrderValidity(user, order);

        //products info for order
        const orderProducts = order.order_items.map((order) => {
            this.checkInventoryAmount(order.product, order.amount);
            return {
                id: order.product.id,
                name: order.product.name,
                price: getDiscountPrice(
                    order.product.price,
                    order.product.discount,
                ),
                amount: order.amount,
                image: order.images[0].img_src,
            };
        });
        //start payment session
        const session = await this.createStripeSession(
            order.buyer_email,
            order.id,
            order.shipping_cost,
            orderProducts,
        );
        return { url: session.url };
    }

    async stripeWebhook(
        signature: string,
        body: Buffer,
    ): Promise<{
        received: string;
    }> {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                webhookSecret,
            );

            if (event.type === "checkout.session.completed") {
                console.log("finished");
                const orderId = (event.data.object as Stripe.Charge).metadata
                    .orderId;
                // update status
                const order = await this.prisma.order.update({
                    where: {
                        id: +orderId,
                    },
                    data: {
                        status: "ACCEPTED",
                        payment_time: new Date(),
                    },
                    include: {
                        order_items: true,
                    },
                });
                // remove items from inventory
                const productUpdates: PrismaPromise<void>[] = [];
                order.order_items.forEach(async (o) => {
                    const update = this.prisma.$queryRaw<void>(
                        updateOrderItemQuery(o),
                    );
                    productUpdates.push(update);
                });
                await Promise.all(productUpdates);
            }
        } catch (err) {
            // On error, log and return the error message
            // logger.error(`Payment webhook error: ${(err as Error).message}`);
            throw new BadRequestException(
                `Webhook Error: ${(err as Error).message}`,
            );
        }
        return { received: "true" };
    }

    private createStripeSession(
        buyer_email: string,
        orderId: OrderId,
        orderShippingCost: number,
        orderProducts: OrderProductsType[],
    ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
        const clientUrl = process.env.CLIENT_URL;
        return stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            metadata: { orderId },
            customer_email: buyer_email,
            shipping_options: [
                {
                    shipping_rate_data: {
                        display_name: "Shipping",
                        type: "fixed_amount",
                        fixed_amount: {
                            amount: 100 * orderShippingCost, // in dollars
                            currency: "usd",
                        },
                    },
                },
            ],
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
            success_url: `${clientUrl}/order_payment?order_id=${orderId}&success=true`,
            cancel_url: `${clientUrl}/order_payment?order_id=${orderId}&success=false`,
        });
    }

    private checkOrderValidity(user: User, order: OrderWithItems): void {
        if (order == null) {
            throw new BadRequestException("Failed to retrieve order data");
        }
        if (user.id !== order.user_id) {
            throw new BadRequestException("Order does not belong to this user");
        }

        if (order.status !== "PENDING") {
            throw new BadRequestException("This order has been paid already");
        }
    }

    private checkInventoryAmount(product: Product, amount: number): void {
        if (product.inventory < amount) {
            throw new BadRequestException(
                `We don't have ${product.name} in this amount: ${amount}`,
            );
        }
    }
}
