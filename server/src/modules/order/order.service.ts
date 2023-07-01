import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";
import { PrismaService } from "../prisma/prisma.service";
import {
    cancelOrderQuery,
    deleteOrderQuery,
    getOrdersByUserQuery,
} from "./order.queries";
import { OrderId, OrderWithItems } from "./order.types";
import { User } from "@prisma/client";

@Injectable()
export class OrderService {
    constructor(
        @InjectQueue("stale-order") private staleOrderQueue: Queue,
        private prisma: PrismaService,
    ) {}

    addOrderToQueue(orderId: OrderId): void {
        this.staleOrderQueue.add(
            { id: orderId },
            {
                delay: 24 * 60 * 60 * 1000, //24 hours
                removeOnComplete: true,
                attempts: 3, // If job fails it will retry 3 timess
                backoff: {
                    type: "exponential",
                    delay: 60 * 60 * 1000, //retry delays: 1hour, 2hours, 4 hours
                },
            },
        );
    }
    getOrders(user: User): Promise<OrderWithItems[]> {
        const sessionUserId = user.id;
        return this.prisma.$queryRaw<OrderWithItems[]>(
            getOrdersByUserQuery(sessionUserId),
        );
    }
    async cancelOrder(id: OrderId): Promise<void> {
        await this.prisma.$queryRaw(cancelOrderQuery(id));
    }
    async deleteOrder(id: OrderId): Promise<void> {
        await this.prisma.$queryRaw(deleteOrderQuery(id));
    }
}
