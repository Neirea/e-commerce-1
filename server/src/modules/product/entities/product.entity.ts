import { CompanyId } from "src/modules/company/company.types";
import {
    ProductDescription,
    ProductDiscount,
    ProductId,
    ProductInventory,
    ProductName,
    ProductPrice,
    ProductShippingCost,
} from "../product.types";
import { CategoryId } from "src/modules/category/category.types";

export class Product {
    id: ProductId;
    name: ProductName;
    price: ProductPrice;
    description: ProductDescription;
    inventory: ProductInventory;
    company_id: CompanyId;
    category_id: CategoryId;
    shipping_cost: ProductShippingCost;
    discount: ProductDiscount;
    created_at: Date;
    updated_at: Date;
}
