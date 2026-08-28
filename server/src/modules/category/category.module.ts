import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service.js";
import { CategoryController } from "./category.controller.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { CloudinaryService } from "../cloudinary/cloudinary.service.js";

@Module({
    controllers: [CategoryController],
    providers: [CategoryService, PrismaService, CloudinaryService],
})
export class CategoryModule {}
