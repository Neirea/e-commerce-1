import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { createCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CategoryId } from "./category.types";
import { RolesGuard } from "src/common/roles/roles.guard";
import { Roles } from "src/common/roles/roles.decorator";
import { Role } from "@prisma/client";
import { CategoryWithCompaniesDto } from "./dto/get-categories.dto";

@Controller("category")
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    getCategories(): Promise<CategoryWithCompaniesDto[]> {
        return this.categoryService.getCategories();
    }

    @Post()
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    createCategory(@Body() body: createCategoryDto): void {
        this.categoryService.createCategory(body);
    }

    @Patch(":id")
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    updateCategory(
        @Param("id") id: CategoryId,
        @Body() body: UpdateCategoryDto,
    ): void {
        this.categoryService.updateCategory(id, body);
    }

    @Delete(":id")
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    deleteCategory(@Param("id") id: CategoryId): void {
        this.categoryService.deleteCategory(id);
    }
}
