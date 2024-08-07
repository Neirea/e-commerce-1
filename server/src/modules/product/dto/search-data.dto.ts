import { Transform, TransformFnParams } from "class-transformer";
import { IsOptional, Min } from "class-validator";
import { TCategoryId } from "src/modules/category/category.types";
import { Category } from "src/modules/category/entities/category.entity";
import { TCompanyId } from "src/modules/company/company.types";
import { Company } from "src/modules/company/entities/company.entity";

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
