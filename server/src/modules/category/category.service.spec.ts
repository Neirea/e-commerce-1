import { Test, TestingModule } from "@nestjs/testing";
import { CategoryService } from "./category.service";
import { PrismaService } from "../prisma/prisma.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { getCategoriesQuery } from "./category.queries";

describe("CategoryService", () => {
    let service: CategoryService;
    let prismaServiceMock: Partial<PrismaService> & {
        $queryRaw: jest.Mock;
        $transaction: jest.Mock;
    };
    let cloudinaryServiceMock: Partial<CloudinaryService> & {
        upload: jest.Mock;
    };

    beforeEach(async () => {
        prismaServiceMock = {
            $queryRaw: jest.fn(),
            $transaction: jest.fn(),
        };
        cloudinaryServiceMock = {
            upload: jest.fn(),
            deleteOne: jest.fn(),
            deleteMany: jest.fn(),
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoryService,
                {
                    provide: PrismaService,
                    useValue: prismaServiceMock,
                },
                {
                    provide: CloudinaryService,
                    useValue: cloudinaryServiceMock,
                },
            ],
        }).compile();

        service = module.get<CategoryService>(CategoryService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("getCategories", () => {
        const mockResult = [
            { id: 1, name: "PC components" },
            { id: 2, name: "RAM", parent_id: 1 },
        ];
        it("should return list of categories", async () => {
            prismaServiceMock.$queryRaw.mockImplementation(() => mockResult);
            const result = await service.getCategories();

            expect(prismaServiceMock.$queryRaw).toHaveBeenCalledWith(
                getCategoriesQuery,
            );
            expect(result).toEqual(mockResult);
        });
    });

    describe("updateCategory", () => {
        const mockResult = [
            { id: 1, name: "PC components" },
            { id: 2, name: "RAM", parent_id: 1 },
        ];
        it("should update category", async () => {
            prismaServiceMock.$queryRaw.mockImplementation(() => mockResult);
            prismaServiceMock.$transaction.mockImplementationOnce(() => [
                mockResult,
            ]);
            const result = service.updateCategory(1, {
                name: "wow",
                img_id: "123",
                img_src: "123",
            });
            expect(result).resolves.not.toThrow();
        });
    });
});
