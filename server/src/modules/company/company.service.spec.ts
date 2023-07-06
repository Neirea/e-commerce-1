import { Test, TestingModule } from "@nestjs/testing";
import { CompanyService } from "./company.service";
import { PrismaService } from "../prisma/prisma.service";

describe("CompanyService", () => {
    let service: CompanyService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CompanyService, PrismaService],
        }).compile();

        service = module.get<CompanyService>(CompanyService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
