import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service.js";
import { PaymentController } from "./payment.controller.js";
import { PrismaService } from "../prisma/prisma.service.js";

@Module({
    controllers: [PaymentController],
    providers: [PaymentService, PrismaService],
})
export class PaymentModule {}
