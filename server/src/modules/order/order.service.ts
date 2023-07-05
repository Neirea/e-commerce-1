import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
    cancelOrderQuery,
    deleteOrderQuery,
    getOrdersByUserQuery,
} from "./order.queries";
import { OrderId } from "./order.types";
import { OrderWithItemsDto } from "./dto/get-orders.dto";
import { UserId } from "../user/user.types";

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) {}

    getOrders(userId: UserId): Promise<OrderWithItemsDto[]> {
        return this.prisma.$queryRaw<OrderWithItemsDto[]>(
            getOrdersByUserQuery(userId),
        );
    }
    async cancelOrder(id: OrderId, userId: UserId): Promise<void> {
        await this.prisma.$queryRaw(cancelOrderQuery(id, userId));
    }
    async deleteOrder(id: OrderId, userId: UserId): Promise<void> {
        await this.prisma.$queryRaw(deleteOrderQuery(id, userId));
    }
}
