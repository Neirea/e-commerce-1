import { Company, Product, ProductImage } from "@prisma/client";
import { ExtendedCategory } from "./dto/search-data.dto";

export type TProductId = Pick<Product, "id">["id"];
export type TProductName = Pick<Product, "name">["name"];
export type TProductPrice = Pick<Product, "price">["price"];
export type TProductDescription = Pick<Product, "description">["description"];
export type TProductInventory = Pick<Product, "inventory">["inventory"];
export type TProductShippingCost = Pick<
    Product,
    "shipping_cost"
>["shipping_cost"];
export type TProductDiscount = Pick<Product, "discount">["discount"];
export type TPropductImgId = Pick<ProductImage, "img_id">["img_id"];
export type TPropductImgSrc = Pick<ProductImage, "img_src">["img_src"];

export type TSearchData = {
    company: Company;
    category: ExtendedCategory;
    price: number;
    discount: number;
};
