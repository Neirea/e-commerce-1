import { Transform, TransformFnParams } from "class-transformer";
import { IsIn, IsOptional, Min } from "class-validator";
import { CategoryId } from "src/modules/category/category.types";
import { CompanyId } from "src/modules/company/company.types";
import { FeaturedProductsDto } from "./featured-products.dto";

export class FilteredProductsDto extends FeaturedProductsDto {
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    category_id: CategoryId;
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    company_id: CompanyId;
    @IsOptional()
    @Transform(({ value }: TransformFnParams) => Number(value))
    @Min(0)
    min_price: number;
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    max_price: number;
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsIn([1, 2, 3])
    @IsOptional()
    sort_mode: number;
    @IsOptional()
    search_string: string;
}
