import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";
import { PrismaService } from "../prisma/prisma.service";
import { RemoveOrderDto } from "./dto/remove-order.dto";
import {
    cancelOrderQuery,
    deleteOrderQuery,
    getOrdersQuery,
} from "./order.queries";

@Injectable()
export class OrderService {
    constructor(
        @InjectQueue("stale-order") private staleOrderQueue: Queue,
        private prisma: PrismaService,
    ) {}

    addOrderToQueue(orderId: number) {
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

    getOrders() {
        // if (req.session.user == null) {
        //     throw new AuthenticationError(
        //         "You must login to access this route"
        //     );
        // }

        //any user id
        const sessionUserId = 1;
        return this.prisma.$queryRaw`${getOrdersQuery(sessionUserId)}`;
    }
    async cancelOrder(input: RemoveOrderDto) {
        await this.prisma.$queryRaw`${cancelOrderQuery(input)}`;
        return true;
    }
    async deleteOrder(input: RemoveOrderDto) {
        await this.prisma.$queryRaw`${deleteOrderQuery(input)}`;
        return true;
    }
}
