import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { StaleOrderProcessor } from "./stale-order.processor";

@Module({
    imports: [
        BullModule.forRoot({
            redis: process.env.REDIS_URL,
        }),
    ],
    providers: [StaleOrderProcessor, PrismaService],
})
export class QueuesModule {}
