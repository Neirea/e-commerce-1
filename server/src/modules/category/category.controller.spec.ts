import { Test, TestingModule } from "@nestjs/testing";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { PrismaService } from "../prisma/prisma.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

describe("CategoryController", () => {
    let controller: CategoryController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CategoryController],
            providers: [CategoryService, PrismaService, CloudinaryService],
        }).compile();

        controller = module.get<CategoryController>(CategoryController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
