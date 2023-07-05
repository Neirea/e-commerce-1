import { BadRequestException, Injectable } from "@nestjs/common";
import { Category } from "@prisma/client";
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
import { CategoryWithCompaniesDto } from "./dto/get-categories.dto";
import { CategoryId } from "./category.types";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Injectable()
export class CategoryService {
    constructor(
        private prisma: PrismaService,
        private cloudinary: CloudinaryService,
    ) {}

    getCategories(): Promise<CategoryWithCompaniesDto[]> {
        return this.prisma.$queryRaw<CategoryWithCompaniesDto[]>(
            categoriesQuery,
        );
    }

    async createCategory(input: createCategoryDto): Promise<void> {
        await this.prisma.$queryRaw(createCategoryQuery(input));
    }

    async updateCategory(
        id: CategoryId,
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
            this.cloudinary.deleteOne(oldCategory[0].img_id);
        }
    }
    async deleteCategory(id: CategoryId): Promise<void> {
        const data = await this.prisma.$queryRaw<[Category]>(
            deleteCategoryQuery(id),
        );
        if (data[0].img_id) {
            this.cloudinary.deleteOne(data[0].img_id);
        }
    }
}
