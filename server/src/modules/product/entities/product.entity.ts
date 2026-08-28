import { TCompanyId } from "../../../modules/company/company.types.js";
import {
    TProductDescription,
    TProductDiscount,
    TProductId,
    TProductInventory,
    TProductName,
    TProductPrice,
    TProductShippingCost,
} from "../product.types.js";
import { TCategoryId } from "../../../modules/category/category.types.js";
import { Product as TProduct } from "../../../database/generated/client.js";

export class Product implements TProduct {
    id: TProductId;
    name: TProductName;
    price: TProductPrice;
    description: TProductDescription;
    inventory: TProductInventory;
    company_id: TCompanyId;
    category_id: TCategoryId;
    shipping_cost: TProductShippingCost;
    discount: TProductDiscount;
    created_at: Date;
    updated_at: Date;
}
