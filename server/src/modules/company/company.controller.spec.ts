import { Test, TestingModule } from "@nestjs/testing";
import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";
import { PrismaService } from "../prisma/prisma.service";

describe("CompanyController", () => {
    let controller: CompanyController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CompanyController],
            providers: [CompanyService, PrismaService],
        }).compile();

        controller = module.get<CompanyController>(CompanyController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
