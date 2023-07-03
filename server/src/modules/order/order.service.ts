import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
    cancelOrderQuery,
    deleteOrderQuery,
    getOrdersByUserQuery,
} from "./order.queries";
import { OrderId } from "./order.types";
import { User } from "@prisma/client";
import { OrderWithItemsDto } from "./dto/get-orders.dto";

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) {}

    getOrders(user: User): Promise<OrderWithItemsDto[]> {
        const sessionUserId = user.id;
        return this.prisma.$queryRaw<OrderWithItemsDto[]>(
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
