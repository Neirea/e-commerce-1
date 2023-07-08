import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBody, ApiOperation } from "@nestjs/swagger";
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
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                token: {
                    type: "string",
                },
            },
            required: ["token"],
        },
    })
    async handleCron(@Body("token") token: string): Promise<void> {
        if (token !== process.env.TOKEN_SECRET) return;
        console.log("Deleting old pending orders...");
        await this.prisma.$queryRaw(deletePendingOrdersQuery);
    }
}
