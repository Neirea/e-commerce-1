import { Transform, TransformFnParams } from "class-transformer";
import { IsIn, IsOptional, Min } from "class-validator";
import type { TCategoryId } from "../../../modules/category/category.types.js";
import type { TCompanyId } from "../../../modules/company/company.types.js";
import { FeaturedProductsDto } from "./featured-products.dto.js";
import { ProductWithImagesDto } from "./product-with-images.dto.js";
import { Category } from "../../../modules/category/entities/category.entity.js";
import { Company } from "../../../modules/company/entities/company.entity.js";

export class FilteredProductsQueryDto extends FeaturedProductsDto {
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    category_id?: TCategoryId;
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    company_id?: TCompanyId;
    @IsOptional()
    @Transform(({ value }: TransformFnParams) => Number(value))
    @Min(0)
    min_price?: number;
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    max_price?: number;
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsIn([1, 2, 3])
    @IsOptional()
    sort_mode?: number;
    @IsOptional()
    search_string?: string;
}

export class FilteredProductsResponseDto extends ProductWithImagesDto {
    category: Category;
    company: Company;
}
