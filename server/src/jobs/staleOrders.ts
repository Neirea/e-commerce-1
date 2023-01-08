import Bull from "bull";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const queue: Bull.Queue<{ id: number }> = new Bull(
    "stale_order",
    process.env.REDIS_URL!
);

function addOrderToQueue(orderId: number) {
    const jobId = `order-${orderId}`;
    queue.process(jobId, async (job) => {
        await prisma.order.deleteMany({
            where: {
                id: job.data.id,
                status: "PENDING",
            },
        });
    });
    queue.add(
        jobId,
        { id: orderId },
        {
            delay: 24 * 60 * 60 * 1000, //1day
            removeOnComplete: true,
            attempts: 3, // If job fails it will retry 3 timess
            backoff: {
                type: "exponential",
                delay: 60 * 60 * 1000, //retry delays: 1hour, 2hours, 4 hours
            },
        }
    );
}

queue.on("failed", (job, err) => {
    console.log("Error at job.id:", job.id, err);
});

export default addOrderToQueue;
