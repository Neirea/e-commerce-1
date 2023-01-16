import Bull from "bull";
import prisma from "../prisma";

const queue: Bull.Queue<{ id: number }> = new Bull(
    "stale_order",
    process.env.REDIS_URL!
);

queue.process(async (job) => {
    await prisma.$queryRaw`
        DELETE FROM public."Order"
        WHERE id = ${job.data.id} AND "status" = 'PENDING'
    `;
});

function addOrderToQueue(orderId: number) {
    queue.add(
        { id: orderId },
        {
            delay: 24 * 60 * 60 * 1000, //24 hours
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
