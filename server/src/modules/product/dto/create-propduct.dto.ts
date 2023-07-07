import { CategoryId } from "src/modules/category/category.types";
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
    IsNotEmpty,
    IsObject,
    Length,
    Max,
    Min,
} from "class-validator";
import { SameLength } from "../validators/same-length.validator";

export class CreateProductDto {
    @Length(3, 70)
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
    @IsNotEmpty()
    img_id: PropductImgId[];
    @SameLength("img_id")
    img_src: PropductImgSrc[];
    @IsNotEmpty()
    company_id: CompanyId;
    @IsNotEmpty()
    category_id: CategoryId;
    @IsArray()
    variants: ProductId[];
}
