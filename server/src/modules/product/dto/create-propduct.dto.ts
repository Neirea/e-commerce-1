import type { TCategoryId } from "../../../modules/category/category.types.js";
import type { TCompanyId } from "../../../modules/company/company.types.js";
import type {
    TProductDescription,
    TProductDiscount,
    TProductInventory,
    TProductName,
    TProductPrice,
    TProductShippingCost,
    TProductId,
    TPropductImgId,
    TPropductImgSrc,
} from "../product.types.js";
import {
    IsArray,
    IsNotEmpty,
    IsObject,
    Length,
    Max,
    Min,
} from "class-validator";
import { SameLength } from "../validators/same-length.validator.js";

export class CreateProductDto {
    @Length(3, 70)
    name: TProductName;
    @Min(0)
    price: TProductPrice;
    @IsObject()
    description: TProductDescription;
    @Min(0)
    inventory: TProductInventory;
    @Min(0)
    shipping_cost: TProductShippingCost;
    @Min(0)
    @Max(100)
    discount: TProductDiscount;
    @IsNotEmpty()
    img_id: TPropductImgId[];
    @SameLength("img_id")
    img_src: TPropductImgSrc[];
    @IsNotEmpty()
    company_id: TCompanyId;
    @IsNotEmpty()
    category_id: TCategoryId;
    @IsArray()
    variants: TProductId[];
}
