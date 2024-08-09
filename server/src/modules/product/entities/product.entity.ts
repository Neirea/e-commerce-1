import { TCompanyId } from "src/modules/company/company.types";
import {
    TProductDescription,
    TProductDiscount,
    TProductId,
    TProductInventory,
    TProductName,
    TProductPrice,
    TProductShippingCost,
} from "../product.types";
import { TCategoryId } from "src/modules/category/category.types";
import { Product as TProduct } from "@prisma/client";

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
