import { Test, TestingModule } from "@nestjs/testing";
import { CategoryService } from "./category.service";
import { PrismaService } from "../prisma/prisma.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { getCategoriesQuery } from "./category.queries";
import {
    CloudinaryServiceMockType,
    PrismaServiceMockType,
} from "src/utils/types.mock";

describe("CategoryService", () => {
    let service: CategoryService;
    let prismaService: PrismaServiceMockType;
    let cloudinaryService: CloudinaryServiceMockType;

    beforeEach(async () => {
        const prismaMock = {
            $queryRaw: jest.fn(),
            $transaction: jest.fn(),
        };
        const cloudinaryMock = {
            upload: jest.fn(),
            deleteOne: jest.fn(),
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoryService,
                {
                    provide: PrismaService,
                    useValue: prismaMock,
                },
                {
                    provide: CloudinaryService,
                    useValue: cloudinaryMock,
                },
            ],
        }).compile();

        service = module.get<CategoryService>(CategoryService);
        prismaService = module.get<PrismaServiceMockType>(PrismaService);
        cloudinaryService =
            module.get<CloudinaryServiceMockType>(CloudinaryService);
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
            prismaService.$queryRaw.mockImplementation(() => mockResult);

            const result = await service.getCategories();

            expect(prismaService.$queryRaw).toHaveBeenCalledWith(
                getCategoriesQuery,
            );
            expect(result).toEqual(mockResult);
        });
    });

    describe("updateCategory", () => {
        const oldCategory = [
            {
                id: 1,
                name: "PC components",
                img_id: "1",
                img_src: "example.com/1",
            },
        ];
        it("should update category", async () => {
            prismaService.$queryRaw.mockImplementation(() => oldCategory);
            prismaService.$transaction.mockImplementationOnce(() => [
                oldCategory,
            ]);
            const result = service.updateCategory(1, {
                name: "PC components",
                img_id: "1",
                img_src: "example.com/1",
            });

            await expect(result).resolves.not.toThrow();

            expect(cloudinaryService.deleteOne).toHaveBeenCalledWith(
                oldCategory[0].img_id,
            );
        });
    });
});
