import { BadRequestException, Injectable } from "@nestjs/common";
import { Category } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { PrismaService } from "../prisma/prisma.service";
import { createCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import {
    categoriesQuery,
    categoryByIdQuery,
    createCategoryQuery,
    deleteCategoryQuery,
    updateCategoryQuery,
} from "./category.queries";
import { CategoryWithCompanies, CateogoryId } from "./category.types";

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}

    getCategories(): Promise<CategoryWithCompanies[]> {
        return this.prisma.$queryRaw<CategoryWithCompanies[]>(categoriesQuery);
    }

    async createCategory(input: createCategoryDto): Promise<void> {
        await this.prisma.$queryRaw(createCategoryQuery(input));
    }

    async updateCategory(
        id: CateogoryId,
        input: UpdateCategoryDto,
    ): Promise<void> {
        if (id === input.parent_id) {
            throw new BadRequestException("Can not assign itself as a parent");
        }

        const oldCategory = await this.prisma.$queryRaw<[Category]>(
            categoryByIdQuery(id),
        );

        await this.prisma.$queryRaw(updateCategoryQuery(id, input));
        if (oldCategory[0].img_id && input.img_id) {
            cloudinary.uploader.destroy(oldCategory[0].img_id);
        }
    }
    async deleteCategory(id: CateogoryId): Promise<void> {
        const data = await this.prisma.$queryRaw<[Category]>(
            deleteCategoryQuery(id),
        );
        if (data[0].img_id) {
            cloudinary.uploader.destroy(data[0].img_id);
        }
    }
}
