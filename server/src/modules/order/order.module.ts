import { Module } from "@nestjs/common";
import { OrderService } from "./order.service.js";
import { OrderController } from "./order.controller.js";
import { PrismaService } from "../prisma/prisma.service.js";

@Module({
    controllers: [OrderController],
    providers: [OrderService, PrismaService],
})
export class OrderModule {}
