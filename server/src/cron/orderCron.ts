import { PrismaClient } from "@prisma/client";
import cron from "node-cron";

const prisma = new PrismaClient();

export default function scheduleOrderCron() {
    //run every 3hours
    cron.schedule("0 */3 * * *", async () => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);
        const { count } = await prisma.order.deleteMany({
            where: {
                status: "PENDING",
                created_at: {
                    lte: currentDate,
                },
            },
        });
        console.log("ran after 3hours and deleted", count, "pending orders");
    });
}
