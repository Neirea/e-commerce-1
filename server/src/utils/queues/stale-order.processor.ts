import { OnQueueFailed, Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { PrismaService } from "src/modules/prisma/prisma.service";

@Processor("stale-order")
export class StaleOrderProcessor {
    constructor(private prisma: PrismaService) {}
    @Process()
    async removePending(job: Job<{ id: number }>): Promise<void> {
        await this.prisma.$queryRaw`
            DELETE FROM public."Order"
            WHERE id = ${job.data.id} AND "status" = 'PENDING'
        `;
    }
    @OnQueueFailed()
    failedRemoval(job: Job, err: Error): void {
        console.error("Job " + job.id + " error:", err.message);
    }
}
