import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "../prisma/prisma.service";
import { deletePendingOrdersQuery } from "../order/order.queries";

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) {}
    //every day at 4 am
    @Cron("0 0 4 * * *")
    handleCron(): void {
        this.prisma.$queryRaw(deletePendingOrdersQuery);
    }
}
