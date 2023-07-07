import { Test, TestingModule } from "@nestjs/testing";
import { ProductService } from "./product.service";
import { PrismaService } from "../prisma/prisma.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { ProductWithVariantsDto } from "./dto/get-product.dto";
import {
    filteredProductsQuery,
    getProductByIdQuery,
    getProducts,
    getProductsByIdsQuery,
    getSearchDataQuery,
} from "./product.queries";
import { SearchDataResponseDto } from "./dto/search-data.dto";
import { SearchDataType } from "./product.types";
import { subCategoriesQuery } from "./utils/sql";
import {
    FilteredProductsQueryDto,
    FilteredProductsResponseDto,
} from "./dto/filtered-products.dto";
import { CreateProductDto } from "./dto/create-propduct.dto";
import {
    CloudinaryServiceMockType,
    PrismaServiceMockType,
} from "src/utils/types.mock";

describe("ProductService", () => {
    let service: ProductService;
    let prismaService: PrismaServiceMockType;
    let cloudinaryService: CloudinaryServiceMockType;

    beforeEach(async () => {
        const prismaMock = {
            $queryRaw: jest.fn(),
            $transaction: jest.fn(),
            product: { create: jest.fn(), update: jest.fn() },
        } as PrismaServiceMockType;
        const cloudinaryMock = {
            upload: jest.fn(),
            deleteMany: jest.fn(),
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                { provide: PrismaService, useValue: prismaMock },
                { provide: CloudinaryService, useValue: cloudinaryMock },
            ],
        }).compile();

        service = module.get<ProductService>(ProductService);
        prismaService = module.get<PrismaServiceMockType>(PrismaService);
        cloudinaryService =
            module.get<CloudinaryServiceMockType>(CloudinaryService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("getProducts", () => {
        it("should return an array of products with variants", async () => {
            const expectedProducts: Partial<ProductWithVariantsDto>[] = [
                { id: 1, name: "Product 1" },
                { id: 2, name: "Product 2" },
            ];
            prismaService.$queryRaw.mockImplementation(() => expectedProducts);

            const products = await service.getProducts();
            expect(products).toEqual(expectedProducts);
            expect(prismaService.$queryRaw).toHaveBeenCalledWith(getProducts);
        });
    });

    describe("getProductById", () => {
        it("should return the product with the specified ID", async () => {
            const productId = 1;
            const expectedProduct: Partial<ProductWithVariantsDto> = {
                id: 1,
                name: "Product 1",
            };
            prismaService.$queryRaw.mockImplementation(() => [expectedProduct]);

            const product = await service.getProductById(productId);
            expect(product).toEqual(expectedProduct);
            expect(prismaService.$queryRaw).toHaveBeenCalledWith(
                getProductByIdQuery(productId),
            );
        });
    });

    describe("getProductsByIds", () => {
        it("should return an array of products with images for the specified IDs", async () => {
            const productIds = [1, 2, 3];
            const expectedProducts: Partial<ProductWithVariantsDto>[] = [
                { id: 1, name: "Product 1" },
                { id: 2, name: "Product 2" },
                { id: 3, name: "Product 3" },
            ];
            prismaService.$queryRaw.mockImplementation(() => expectedProducts);

            const products = await service.getProductsByIds(productIds);
            expect(products).toEqual(expectedProducts);
            expect(prismaService.$queryRaw).toHaveBeenCalledWith(
                getProductsByIdsQuery(productIds),
            );
        });

        it("should return an empty array if no IDs are provided", async () => {
            const products = await service.getProductsByIds([]);

            expect(products).toEqual([]);
            expect(prismaService.$queryRaw).not.toHaveBeenCalled();
        });
    });

    describe("getSearchData", () => {
        it("should return search data based on the provided query", async () => {
            const inputData = {
                category_id: 1,
                min_price: 10,
                max_price: 100,
            };
            const expectedSearchData: SearchDataResponseDto = {
                min: 42,
                max: 85,
                categories: [{ id: 1, name: "Category 1", productCount: 2 }],
                companies: [
                    { id: 1, name: "Company 1", productCount: 1 },
                    { id: 2, name: "Company 2", productCount: 1 },
                ],
            };
            const subCatsQueryResponse = [{ id: 1 }];
            const subCategoriesIds = subCatsQueryResponse.map((i) => i.id);
            const dataLookupResponse: SearchDataType[] = [
                {
                    company: { id: 1, name: "Company 1" },
                    category: { id: 1, name: "Category 1" },
                    price: 50,
                    discount: 15,
                },
                {
                    company: { id: 2, name: "Company 2" },
                    category: { id: 1, name: "Category 1" },
                    price: 100,
                    discount: 15,
                },
            ];
            prismaService.$queryRaw
                .mockImplementationOnce(() => subCatsQueryResponse)
                .mockImplementationOnce(() => dataLookupResponse);

            const searchData = await service.getSearchData(inputData);
            expect(searchData).toEqual(expectedSearchData);
            expect(prismaService.$queryRaw).toHaveBeenNthCalledWith(
                1,
                subCategoriesQuery(inputData.category_id),
            );
            expect(prismaService.$queryRaw).toHaveBeenNthCalledWith(
                2,
                getSearchDataQuery(inputData, subCategoriesIds),
            );
        });

        it("should return 0 for min price when no matching products are found", async () => {
            const inputData = {
                category_id: 1,
                min_price: 10,
                max_price: 100,
            };
            const expectedSearchData: SearchDataResponseDto = {
                min: 0,
                max: 0,
                categories: [],
                companies: [],
            };
            prismaService.$queryRaw.mockImplementation(() => []);

            const searchData = await service.getSearchData(inputData);
            expect(searchData).toEqual(expectedSearchData);
            expect(prismaService.$queryRaw).toHaveBeenCalledWith(
                getSearchDataQuery(inputData, expect.any(Array)),
            );
        });
    });

    describe("getFilteredProducts", () => {
        it("should return an array of filtered products based on the provided query", async () => {
            const inputQuery: FilteredProductsQueryDto = {
                limit: 10,
                offset: 0,
                category_id: 1,
                min_price: 10,
                max_price: 100,
            };
            const expectedProducts: Partial<FilteredProductsResponseDto>[] = [
                { id: 1, name: "Product 1", category_id: 1 },
                { id: 2, name: "Product 2", category_id: 1 },
                { id: 3, name: "Product 3", category_id: 1 },
            ];
            const subCatsQueryResponse = [{ id: 1 }];
            prismaService.$queryRaw
                .mockImplementationOnce(() => subCatsQueryResponse)
                .mockImplementationOnce(() => expectedProducts);

            const filteredProducts = await service.getFilteredProducts(
                inputQuery,
            );
            expect(filteredProducts).toEqual(expectedProducts);
            expect(prismaService.$queryRaw).toHaveBeenNthCalledWith(
                1,
                subCategoriesQuery(inputQuery.category_id),
            );
            expect(prismaService.$queryRaw).toHaveBeenNthCalledWith(
                2,
                filteredProductsQuery(
                    inputQuery,
                    subCatsQueryResponse.map((i) => i.id),
                ),
            );
        });

        it("should return an empty array if no filtered products are found", async () => {
            const inputQuery: FilteredProductsQueryDto = {
                limit: 10,
                offset: 0,
                category_id: 1,
                min_price: 10,
                max_price: 100,
            };
            prismaService.$queryRaw.mockImplementation(() => []);
            const filteredProducts = await service.getFilteredProducts(
                inputQuery,
            );

            expect(filteredProducts).toEqual([]);
            expect(prismaService.$queryRaw).toHaveBeenCalledWith(
                filteredProductsQuery(inputQuery, expect.any(Array)),
            );
        });
    });

    describe("createProduct", () => {
        it("should create a new product and its associated data", async () => {
            const inputProduct: CreateProductDto = {
                name: "Product 1",
                price: 100,
                description: {},
                inventory: 10,
                shipping_cost: 0,
                discount: 15,
                company_id: 1,
                category_id: 1,
                img_id: [],
                img_src: [],
                variants: [],
            };
            const createdProduct = {
                ...inputProduct,
                id: 1,
                created_at: Date.now(),
                updated_at: Date.now(),
            };
            prismaService.product.create.mockImplementationOnce(
                () => createdProduct,
            );

            await service.createProduct(inputProduct);
            expect(prismaService.product.create).toHaveBeenCalledTimes(1);
        });
    });

    describe("updateProduct", () => {
        it("should update an existing product and its associated data", async () => {
            const inputId = 1;
            const inputProduct: CreateProductDto = {
                name: "Product 1",
                price: 100,
                description: {},
                inventory: 10,
                shipping_cost: 0,
                discount: 15,
                company_id: 1,
                category_id: 1,
                img_id: [],
                img_src: [],
                variants: [],
            };
            prismaService.$transaction.mockImplementation(() => [1, 2]);

            await service.updateProduct(inputId, inputProduct);
            expect(prismaService.product.update).toHaveBeenCalledTimes(1);
            expect(cloudinaryService.deleteMany).not.toHaveBeenCalled();
        });

        it("should delete associated images if provided and there was an error during product update", async () => {
            const inputId = 1;
            const inputProduct: CreateProductDto = {
                name: "Product 1",
                price: 100,
                description: {},
                inventory: 10,
                shipping_cost: 0,
                discount: 15,
                company_id: 1,
                category_id: 1,
                img_id: ["3", "4"],
                img_src: ["example.com/3", "example.com/4"],
                variants: [],
            };

            const oldImages = [
                { img_id: "1", img_src: "example.com/1" },
                { img_id: "2", img_src: "example.com/2" },
            ];

            prismaService.$queryRaw.mockImplementation(() => []);
            prismaService.$transaction.mockImplementation(() => [oldImages]);

            await service.updateProduct(inputId, inputProduct);

            expect(prismaService.product.update).toHaveBeenCalledTimes(1);
            expect(prismaService.$queryRaw).toHaveBeenCalledTimes(3);
            expect(cloudinaryService.deleteMany).toHaveBeenCalledWith(
                oldImages.map((i) => i.img_id),
            );
        });
    });
});
