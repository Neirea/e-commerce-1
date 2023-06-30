import { CompanyId } from "src/modules/company/company.types";
import { ProductId } from "../product.types";
import { CateogoryId } from "src/modules/category/category.types";
import { FeaturedProductsDto } from "./featured-products.dto";
import { Transform, TransformFnParams } from "class-transformer";
import { IsNumber } from "class-validator";

export class RelatedProductsDto extends FeaturedProductsDto {
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsNumber()
    id: ProductId;
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsNumber()
    company_id: CompanyId;
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsNumber()
    category_id: CateogoryId;
}
