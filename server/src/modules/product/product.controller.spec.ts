import { Test, TestingModule } from "@nestjs/testing";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { PrismaService } from "../prisma/prisma.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

describe("ProductController", () => {
    let controller: ProductController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [ProductService, PrismaService, CloudinaryService],
        }).compile();

        controller = module.get<ProductController>(ProductController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
