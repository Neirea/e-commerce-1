import { BadRequestException, Injectable } from "@nestjs/common";
import { Category } from "src/database/generated/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import {
    getCategoriesQuery,
    categoryByIdQuery,
    createCategoryQuery,
    deleteCategoryQuery,
    updateCategoryQuery,
} from "./category.queries";
import { CategoryWithCompaniesDto } from "./dto/get-categories.dto";
import { TCategoryId } from "./category.types";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Injectable()
export class CategoryService {
    constructor(
        private prisma: PrismaService,
        private cloudinary: CloudinaryService,
    ) {}

    getCategories(): Promise<CategoryWithCompaniesDto[]> {
        return this.prisma.$queryRaw<CategoryWithCompaniesDto[]>(
            getCategoriesQuery,
        );
    }

    async createCategory(input: CreateCategoryDto): Promise<void> {
        await this.prisma.$queryRaw(createCategoryQuery(input));
    }

    async updateCategory(
        id: TCategoryId,
        input: UpdateCategoryDto,
    ): Promise<void> {
        if (id === input.parent_id) {
            throw new BadRequestException("Can not assign itself as a parent");
        }
        const getOldCategory = this.prisma.$queryRaw<[Category]>(
            categoryByIdQuery(id),
        );
        const updateCategory = this.prisma.$queryRaw(
            updateCategoryQuery(id, input),
        );
        const [oldCategory] = await this.prisma.$transaction([
            getOldCategory,
            updateCategory,
        ]);
        if (oldCategory[0].img_id && input.img_id) {
            await this.cloudinary.deleteOne(oldCategory[0].img_id);
        }
    }
    async deleteCategory(id: TCategoryId): Promise<void> {
        const data = await this.prisma.$queryRaw<[Category]>(
            deleteCategoryQuery(id),
        );
        if (data[0].img_id) {
            await this.cloudinary.deleteOne(data[0].img_id);
        }
    }
}
