import { CateogoryId } from "src/modules/category/category.types";
import { CompanyId } from "src/modules/company/company.types";
import {
    ProductDescription,
    ProductDiscount,
    ProductInventory,
    ProductName,
    ProductPrice,
    ProductShippingCost,
    ProductId,
    PropductImgId,
    PropductImgSrc,
} from "../product.types";
import {
    IsArray,
    IsNumber,
    IsObject,
    IsOptional,
    Length,
    Max,
    Min,
} from "class-validator";
import { SameLength } from "../validators/same-length";

export class CreateProductDto {
    @Length(3, 20)
    name: ProductName;
    @Min(0)
    price: ProductPrice;
    @IsObject()
    description: ProductDescription;
    @Min(0)
    inventory: ProductInventory;
    @Min(0)
    shipping_cost: ProductShippingCost;
    @Min(0)
    @Max(100)
    discount: ProductDiscount;
    @IsOptional()
    img_id: PropductImgId[];
    @IsOptional()
    @SameLength("img_id")
    img_src: PropductImgSrc[];
    @IsNumber()
    company_id: CompanyId;
    @IsNumber()
    category_id: CateogoryId;
    @IsArray()
    variants: ProductId[];
}
