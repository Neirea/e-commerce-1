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
import { CategoryWithCompanies, CateogoryId } from "./category.types";
import { RolesGuard } from "src/common/roles/roles.guard";
import { Roles } from "src/common/roles/roles.decorator";
import { Role } from "@prisma/client";

@Controller("category")
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    getCategories(): Promise<CategoryWithCompanies[]> {
        return this.categoryService.getCategories();
    }

    @Post()
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    createCategory(@Body() body: createCategoryDto): Promise<void> {
        return this.categoryService.createCategory(body);
    }

    @Patch(":id")
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    updateCategory(
        @Param("id") id: CateogoryId,
        @Body() body: UpdateCategoryDto,
    ): Promise<void> {
        return this.categoryService.updateCategory(id, body);
    }

    @Delete(":id")
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    deleteCategory(@Param("id") id: CateogoryId): Promise<void> {
        return this.categoryService.deleteCategory(id);
    }
}
