import { CompanyId } from "src/modules/company/company.types";
import { ProductId } from "../product.types";
import { CategoryId } from "src/modules/category/category.types";
import { FeaturedProductsDto } from "./featured-products.dto";
import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class RelatedProductsDto extends FeaturedProductsDto {
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsNotEmpty()
    id: ProductId;
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsNotEmpty()
    company_id: CompanyId;
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsNotEmpty()
    category_id: CategoryId;
}
