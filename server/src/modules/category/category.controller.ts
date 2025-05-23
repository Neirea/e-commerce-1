import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    UseFilters,
    UseGuards,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { TCategoryId } from "./category.types";
import { RolesGuard } from "src/common/roles/roles.guard";
import { Roles } from "src/common/roles/roles.decorator";
import { Role } from "@prisma/client";
import { ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CategoryWithCompaniesDto } from "./dto/get-categories.dto";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { SingleUploadFilter } from "./category.filter";

@ApiTags("category")
@Controller("category")
@UseFilters(SingleUploadFilter)
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    @ApiOperation({ summary: "Retrieves all categories with their companies" })
    getCategories(): Promise<CategoryWithCompaniesDto[]> {
        return this.categoryService.getCategories();
    }

    @Post()
    @ApiOperation({ summary: "Creates category" })
    @ApiCookieAuth()
    @UseGuards(AuthenticatedGuard)
    @Roles(Role.EDITOR)
    @UseGuards(RolesGuard)
    async createCategory(@Body() body: CreateCategoryDto): Promise<void> {
        await this.categoryService.createCategory(body);
    }

    @Patch(":id")
    @HttpCode(204)
    @ApiOperation({ summary: "Updates specific category" })
    @ApiCookieAuth()
    @UseGuards(AuthenticatedGuard)
    @Roles(Role.EDITOR)
    @UseGuards(RolesGuard)
    async updateCategory(
        @Param("id") id: TCategoryId,
        @Body() body: UpdateCategoryDto,
    ): Promise<void> {
        await this.categoryService.updateCategory(id, body);
    }

    @Delete(":id")
    @HttpCode(204)
    @ApiOperation({ summary: "Deletes specific category" })
    @ApiCookieAuth()
    @UseGuards(AuthenticatedGuard)
    @Roles(Role.EDITOR)
    @UseGuards(RolesGuard)
    async deleteCategory(@Param("id") id: TCategoryId): Promise<void> {
        await this.categoryService.deleteCategory(id);
    }
}
