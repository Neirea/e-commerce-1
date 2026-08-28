import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import {
    cancelOrderQuery,
    deleteOrderQuery,
    getOrdersByUserQuery,
} from "./order.queries.js";
import { TOrderId } from "./order.types.js";
import { OrderWithItemsDto } from "./dto/get-orders.dto.js";
import { TUserId } from "../user/user.types.js";

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) {}

    getOrders(TUserId: TUserId): Promise<OrderWithItemsDto[]> {
        return this.prisma.$queryRaw<OrderWithItemsDto[]>(
            getOrdersByUserQuery(TUserId),
        );
    }
    async cancelOrder(id: TOrderId, TUserId: TUserId): Promise<void> {
        await this.prisma.$queryRaw(cancelOrderQuery(id, TUserId));
    }
    async deleteOrder(id: TOrderId, TUserId: TUserId): Promise<void> {
        await this.prisma.$queryRaw(deleteOrderQuery(id, TUserId));
    }
}
