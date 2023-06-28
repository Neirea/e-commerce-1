import { Injectable } from "@nestjs/common";
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
import { DeleteCategoryDto } from "./dto/delete-category.dto";

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}

    getCategories() {
        return this.prisma.$queryRaw`${categoriesQuery}`;
    }

    async createCategory(input: createCategoryDto) {
        // Authorization
        // if (!req.session.user?.role.includes(Role.ADMIN)) {
        //     throw new AuthenticationError(
        //         "You don't have permissions for this action"
        //     );
        // }
        // Validation
        // if (input.name.length < 3) {
        //     throw new UserInputError("Name is too short");
        // }

        await this.prisma.$queryRaw`${createCategoryQuery(input)}`;
        return true;
    }

    async updateCategory(input: UpdateCategoryDto) {
        // if (!req.session.user?.role.includes(Role.ADMIN)) {
        //     throw new AuthenticationError(
        //         "You don't have permissions for this action",
        //     );
        // }
        // if (input.name.length < 3) {
        //     throw new UserInputError("Name is too short");
        // }
        // if (category_id === parent_id) {
        //     throw new UserInputError("Can not assign itself as a parent");
        // }

        const oldCategory = await this.prisma.$queryRaw<
            [Category]
        >`${categoryByIdQuery(input.id)}`;

        await this.prisma.$queryRaw`${updateCategoryQuery(input)}`;
        if (oldCategory[0].img_id && input.img_id) {
            cloudinary.uploader.destroy(oldCategory[0].img_id);
        }
        return true;
    }
    async deleteCategory(input: DeleteCategoryDto) {
        // if (!req.session.user?.role.includes(Role.ADMIN)) {
        //     throw new AuthenticationError(
        //         "You don't have permissions for this action"
        //     );
        // }
        const data = await this.prisma.$queryRaw<
            [Category]
        >`${deleteCategoryQuery(input)}`;
        if (data[0].img_id) {
            cloudinary.uploader.destroy(data[0].img_id);
        }
        return true;
    }
}
