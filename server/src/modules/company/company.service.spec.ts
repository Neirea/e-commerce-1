import { Test, TestingModule } from "@nestjs/testing";
import { CompanyService } from "./company.service";
import { PrismaService } from "../prisma/prisma.service";
import { getCompaniesQuery } from "./company.queries";
import { PrismaServiceMockType } from "src/utils/types.mock";

describe("CompanyService", () => {
    let service: CompanyService;
    let prismaService: PrismaServiceMockType;

    beforeEach(async () => {
        const prismaMock = {
            $queryRaw: jest.fn(),
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CompanyService,
                {
                    provide: PrismaService,
                    useValue: prismaMock,
                },
            ],
        }).compile();

        service = module.get<CompanyService>(CompanyService);
        prismaService = module.get<PrismaServiceMockType>(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("getCompanies", () => {
        it("should return list of products", async () => {
            const mockResult = [
                { id: 1, name: "Apple" },
                { id: 2, name: "Samsung" },
            ];
            prismaService.$queryRaw.mockImplementationOnce(() => mockResult);

            const result = await service.getCompanies();

            expect(prismaService.$queryRaw).toHaveBeenCalledWith(
                getCompaniesQuery,
            );
            expect(result).toEqual(mockResult);
        });
    });
});
