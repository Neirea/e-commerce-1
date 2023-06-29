import { CompanyId } from "src/modules/company/company.types";
import { ProductId } from "../product.types";
import { CateogoryId } from "src/modules/category/category.types";
import { FeaturedProductsDto } from "./featured-products.dto";
import { Transform, TransformFnParams } from "class-transformer";

export class RelatedProductsDto extends FeaturedProductsDto {
    @Transform(({ value }: TransformFnParams) => Number(value))
    id: ProductId;
    @Transform(({ value }: TransformFnParams) => Number(value))
    company_id: CompanyId;
    @Transform(({ value }: TransformFnParams) => Number(value))
    category_id: CateogoryId;
}
