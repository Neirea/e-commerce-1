import { Transform, TransformFnParams } from "class-transformer";
import { IsOptional, Min } from "class-validator";
import { CateogoryId } from "src/modules/category/category.types";
import { CompanyId } from "src/modules/company/company.types";

export class SearchDataDto {
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    @Min(0)
    min_price: number;

    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    @Min(0)
    max_price: number;

    @IsOptional()
    search_string: string;

    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    category_id: CateogoryId;
    @IsOptional()
    @Transform(({ value }: TransformFnParams) => Number(value))
    company_id?: CompanyId;
}
