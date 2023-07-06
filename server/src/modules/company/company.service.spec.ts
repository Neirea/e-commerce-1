import { Test, TestingModule } from "@nestjs/testing";
import { CompanyService } from "./company.service";
import { PrismaService } from "../prisma/prisma.service";
import { getCompaniesQuery } from "./company.queries";

describe("CompanyService", () => {
    let service: CompanyService;
    let prismaServiceMock: Partial<PrismaService> & { $queryRaw: jest.Mock };

    beforeEach(async () => {
        prismaServiceMock = {
            $queryRaw: jest.fn(),
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CompanyService,
                {
                    provide: PrismaService,
                    useValue: prismaServiceMock,
                },
            ],
        }).compile();

        service = module.get<CompanyService>(CompanyService);
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
            prismaServiceMock.$queryRaw.mockImplementationOnce(
                () => mockResult,
            );

            const result = await service.getCompanies();

            expect(prismaServiceMock.$queryRaw).toHaveBeenCalledWith(
                getCompaniesQuery,
            );
            expect(result).toEqual(mockResult);
        });
    });
});
