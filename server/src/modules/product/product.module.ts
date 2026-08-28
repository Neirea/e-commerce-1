import { Module } from "@nestjs/common";
import { ProductService } from "./product.service.js";
import { ProductController } from "./product.controller.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { CloudinaryService } from "../cloudinary/cloudinary.service.js";

@Module({
    controllers: [ProductController],
    providers: [ProductService, PrismaService, CloudinaryService],
})
export class ProductModule {}
