import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { deletePendingOrdersQuery } from "src/modules/order/order.queries";
import { PrismaService } from "src/modules/prisma/prisma.service";

@Controller()
export class AppController {
    constructor(private prisma: PrismaService) {}
    @Get("/")
    @ApiOperation({ summary: "Health Check" })
    healthCheck(): string {
        return;
    }
    @Post("/cron")
    @ApiOperation({ summary: "Deletes old pending orders" })
    handleCron(@Body("token") token: string): void {
        if (token !== process.env.TOKEN_SECRET) return;
        this.prisma.$queryRaw(deletePendingOrdersQuery);
    }
}
