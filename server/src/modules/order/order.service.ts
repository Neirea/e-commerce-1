import { Injectable } from "@nestjs/common";
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
    constructor(private prisma: PrismaService) {}

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
