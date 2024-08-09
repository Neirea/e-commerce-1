import { TCompanyId } from "src/modules/company/company.types";
import { TProductId } from "../product.types";
import { TCategoryId } from "src/modules/category/category.types";
import { FeaturedProductsDto } from "./featured-products.dto";
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
