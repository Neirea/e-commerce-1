import { type TCompanyId } from "../../../modules/company/company.types.js";
import { type TProductId } from "../product.types.js";
import { type TCategoryId } from "../../../modules/category/category.types.js";
import { FeaturedProductsDto } from "./featured-products.dto.js";
import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class RelatedProductsDto extends FeaturedProductsDto {
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsNotEmpty()
    id: TProductId;
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsNotEmpty()
    company_id: TCompanyId;
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsNotEmpty()
    category_id: TCategoryId;
}
