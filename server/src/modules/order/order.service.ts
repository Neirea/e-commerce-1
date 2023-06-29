import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";
import { PrismaService } from "../prisma/prisma.service";
import {
    cancelOrderQuery,
    deleteOrderQuery,
    getOrdersQuery,
} from "./order.queries";
import { OrderId } from "./order.types";
import { Request } from "express";

@Injectable()
export class OrderService {
    constructor(
        @InjectQueue("stale-order") private staleOrderQueue: Queue,
        private prisma: PrismaService,
    ) {}

    addOrderToQueue(orderId: OrderId) {
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

    getOrders(req: Request) {
        const sessionUserId = req.session.passport.user.id;
        return this.prisma.$queryRaw(getOrdersQuery(sessionUserId));
    }
    async cancelOrder(id: OrderId) {
        await this.prisma.$queryRaw(cancelOrderQuery(id));
        return true;
    }
    async deleteOrder(id: OrderId) {
        await this.prisma.$queryRaw(deleteOrderQuery(id));
        return true;
    }
}
