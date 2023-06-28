import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { BullModule } from "@nestjs/bull";
import { QueuesModule } from "src/utils/queues/queues.module";
import { PrismaService } from "../prisma/prisma.service";

@Module({
    imports: [QueuesModule, BullModule.registerQueue({ name: "stale-order" })],
    controllers: [OrderController],
    providers: [OrderService, PrismaService],
})
export class OrderModule {}
