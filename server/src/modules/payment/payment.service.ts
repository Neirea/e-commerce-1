import { BadRequestException, Injectable } from "@nestjs/common";
import { InputJsonObject, PrismaPromise } from "@prisma/client/runtime/client";
import { appConfig } from "src/config/env";
import { Product, User } from "src/database/generated/client";
import Stripe from "stripe";
import { updateOrderItemQuery } from "../order/order.queries";
import { PrismaService } from "../prisma/prisma.service";
import { ProductWithImagesDto } from "../product/dto/product-with-images.dto";
import { getProductsByIdsQuery } from "../product/product.queries";
import { CheckoutBodyDto } from "./dto/checkout-body.dto";
import { TOrderItem } from "./payment.types";
import { getDiscountPrice } from "./utils/get-price";

@Injectable()
export class PaymentService {
    private stripe: Stripe;
    constructor(private prisma: PrismaService) {
        this.stripe = new Stripe(appConfig.stripePrivateKey);
    }

    async initializePayment(
        user: User,
        body: CheckoutBodyDto,
    ): Promise<{ clientSecret: string | null }> {
        if (body.items.length === 0) {
            throw new BadRequestException("Your cart is empty");
        }
        if (body.items.some((p) => p.amount === 0)) {
            throw new BadRequestException("Your cart has invalid item");
        }
        const products = await this.prisma.$queryRaw<ProductWithImagesDto[]>(
            getProductsByIdsQuery(body.items.map((i) => i.id)),
        );

        const orderItems: TOrderItem[] = products.map((product) => {
            const orderAmount = body.items.find(
                (p) => p.id === product.id,
            )?.amount;
            if (!orderAmount) {
                throw new BadRequestException(
                    `Product is missing: ${product.name}`,
                );
            }
            this.checkInventoryAmount(product, orderAmount);
            return {
                product_id: product.id,
                amount: orderAmount,
                price: getDiscountPrice(product.price, product.discount),
            };
        });
        const shippingCost = Math.max(...products.map((p) => p.shipping_cost));

        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: this.getOrderPrice(orderItems, shippingCost),
            currency: "USD",
            metadata: {
                user_id: user?.id,
                shipping_cost: shippingCost,
                order_items: JSON.stringify(orderItems),
            },
        });

        return { clientSecret: paymentIntent.client_secret };
    }

    async stripeWebhook(
        signature: string,
        body: Buffer,
    ): Promise<{
        received: string;
    }> {
        const webhookSecret = appConfig.stripeWebhookSecret;

        let event: Stripe.Event;
        try {
            event = this.stripe.webhooks.constructEvent(
                body,
                signature,
                webhookSecret,
            );

            if (event.type === "charge.succeeded") {
                const customer = event.data.object.shipping;
                const email = event.data.object.billing_details.email;
                const info = event.data.object.metadata;
                const orderItems = JSON.parse(info.order_items) as TOrderItem[];
                if (!customer || !customer.name || !email) {
                    throw new BadRequestException("Bad customer data");
                }
                const devliveryAddress = JSON.parse(
                    JSON.stringify(customer.address),
                ) as InputJsonObject;
                const order = await this.prisma.order.create({
                    data: {
                        user_id: Number(info.user_id) || undefined,
                        buyer_name: customer.name,
                        buyer_email: email,
                        delivery_address: devliveryAddress,
                        buyer_phone: customer.phone,
                        shipping_cost: Number(info.shipping_cost),
                        order_items: {
                            createMany: {
                                data: orderItems,
                            },
                        },
                    },
                    include: {
                        order_items: true,
                    },
                });
                const productUpdates: PrismaPromise<void>[] = [];
                order.order_items.forEach((o) => {
                    const update = this.prisma.$queryRaw<void>(
                        updateOrderItemQuery(o),
                    );
                    productUpdates.push(update);
                });
                await this.prisma.$transaction(productUpdates);
            }
        } catch (err) {
            console.error(`Payment webhook error: ${(err as Error).message}`);
            throw new BadRequestException(
                `Webhook Error: ${(err as Error).message}`,
            );
        }
        return { received: "true" };
    }

    private getOrderPrice(
        orderProducts: TOrderItem[],
        shippingCost: number,
    ): number {
        const price = orderProducts.reduce(
            (total, product) => total + product.price,
            shippingCost,
        );
        return price;
    }

    private checkInventoryAmount(product: Product, amount: number): void {
        if (product.inventory < amount) {
            throw new BadRequestException(
                `We don't have ${product.name} in this amount: ${amount}`,
            );
        }
    }
}
