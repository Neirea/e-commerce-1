import { Transform, TransformFnParams } from "class-transformer";
import { IsOptional, Min } from "class-validator";
import type { TCategoryId } from "../../../modules/category/category.types.js";
import { Category } from "../../../modules/category/entities/category.entity.js";
import type { TCompanyId } from "../../../modules/company/company.types.js";
import { Company } from "../../../modules/company/entities/company.entity.js";

export class SearchDataQueryDto {
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    @Min(0)
    min_price?: number;
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    @Min(0)
    max_price?: number;
    @IsOptional()
    search_string?: string;
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    category_id?: TCategoryId;
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    company_id?: TCompanyId;
}

export class ExtendedCategory extends Category {
    productCount?: number;
    parent?: Category;
}

export class ExtendedCompany extends Company {
    productCount?: number;
}

export class SearchDataResponseDto {
    min: number;
    max: number;
    categories: ExtendedCategory[];
    companies: ExtendedCompany[];
}
