import { Company, Product, ProductImage } from "@prisma/client";
import { CategoryId } from "../category/category.types";
import { ExtendedCategory } from "./dto/search-data.dto";

export type ProductId = Pick<Product, "id">["id"];
export type ProductName = Pick<Product, "name">["name"];
export type ProductPrice = Pick<Product, "price">["price"];
export type ProductDescription = Pick<Product, "description">["description"];
export type ProductInventory = Pick<Product, "inventory">["inventory"];
export type ProductShippingCost = Pick<
    Product,
    "shipping_cost"
>["shipping_cost"];
export type ProductDiscount = Pick<Product, "discount">["discount"];
export type PropductImgId = Pick<ProductImage, "img_id">["img_id"];
export type PropductImgSrc = Pick<ProductImage, "img_src">["img_src"];

export type SearchDataType = {
    company: Company;
    category: ExtendedCategory;
    category_id: CategoryId;
    price: number;
    discount: number;
}[];
