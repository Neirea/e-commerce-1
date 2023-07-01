import { Module } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { ScheduleModule } from "@nestjs/schedule";
import { PrismaService } from "../prisma/prisma.service";

@Module({
    imports: [ScheduleModule.forRoot()],
    providers: [PrismaService, TasksService],
})
export class TasksModule {}
