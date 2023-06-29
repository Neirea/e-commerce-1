import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { createCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CateogoryId } from "./category.types";

@Controller("category")
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    getCategories() {
        return this.categoryService.getCategories();
    }

    @Post()
    createCategory(@Body() body: createCategoryDto) {
        return this.categoryService.createCategory(body);
    }

    @Patch(":id")
    updateCategory(
        @Param("id") id: CateogoryId,
        @Body() body: UpdateCategoryDto,
    ) {
        return this.categoryService.updateCategory(id, body);
    }

    @Delete(":id")
    deleteCategory(@Param("id") id: CateogoryId) {
        return this.categoryService.deleteCategory(id);
    }
}
