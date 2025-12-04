import { Company, Product, ProductImage } from "src/database/generated/client";
import { ValidationArguments } from "class-validator";
import { Request } from "express";
import { CreateProductDto } from "./dto/create-propduct.dto";
import { ExtendedCategory } from "./dto/search-data.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

export type TProductId = Pick<Product, "id">["id"];
export type TProductName = Pick<Product, "name">["name"];
export type TProductPrice = Pick<Product, "price">["price"];
// have to exclude null because of prisma bug
export type TProductDescription = Exclude<
    Pick<Product, "description">["description"],
    null
>;
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

export interface IUpsertProductRequest extends Request {
    body: CreateProductDto | UpdateProductDto;
}

export interface ISameLengthValidationArguments extends ValidationArguments {
    constraints: [string];
    object: Record<string, string>;
}
