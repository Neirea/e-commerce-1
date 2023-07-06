import { Test, TestingModule } from "@nestjs/testing";
import { ProductService } from "./product.service";
import { PrismaService } from "../prisma/prisma.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

describe("ProductService", () => {
    let service: ProductService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ProductService, PrismaService, CloudinaryService],
        }).compile();

        service = module.get<ProductService>(ProductService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
