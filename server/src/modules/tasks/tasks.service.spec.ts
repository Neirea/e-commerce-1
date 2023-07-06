import { Test, TestingModule } from "@nestjs/testing";
import { TasksService } from "./tasks.service";
import { PrismaService } from "../prisma/prisma.service";

describe("TasksService", () => {
    let service: TasksService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TasksService, PrismaService],
        }).compile();

        service = module.get<TasksService>(TasksService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
