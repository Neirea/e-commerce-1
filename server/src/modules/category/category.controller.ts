import { Body, Controller, Get, Patch, Post } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { createCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

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

    @Patch()
    updateCategory(@Body() body: UpdateCategoryDto) {
        return this.categoryService.updateCategory(body);
    }
}
