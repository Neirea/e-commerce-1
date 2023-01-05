import Bull from "bull";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const queue: Bull.Queue<{ id: number }> = new Bull(
    "stale_order",
    process.env.REDIS_URL!
);

queue.process((job) => {
    prisma.order.deleteMany({
        where: {
            id: job.data.id,
            status: "PENDING",
        },
    });
});

export default queue;
