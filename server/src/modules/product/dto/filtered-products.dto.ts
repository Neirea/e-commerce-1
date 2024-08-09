import { Transform, TransformFnParams } from "class-transformer";
import { IsIn, IsOptional, Min } from "class-validator";
import { TCategoryId } from "src/modules/category/category.types";
import { TCompanyId } from "src/modules/company/company.types";
import { FeaturedProductsDto } from "./featured-products.dto";
import { ProductWithImagesDto } from "./product-with-images.dto";
import { Category } from "src/modules/category/entities/category.entity";
import { Company } from "src/modules/company/entities/company.entity";

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
