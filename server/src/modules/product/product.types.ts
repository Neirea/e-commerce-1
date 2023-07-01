import { Category, Company, Product, ProductImage } from "@prisma/client";
import { CateogoryId } from "../category/category.types";

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

export type ProductWithImages = Product & { images: ProductImage[] };
export type ProductWithCatCom = ProductWithImages & {
    company: Company;
    category: Category;
};
export type ProductWithVariants = Product & { variants: Product[] };
export type ProductWithImgVariants = ProductWithImages & {
    variants: ProductWithImages[];
    company: Company;
    category: Category;
};

export type SearchDataType = {
    company: Company;
    category: Category;
    category_id: CateogoryId;
    price: number;
    discount: number;
}[];

export type CategoryType = Category & { productCount?: number } & {
    parent?: Category | null;
};
export type CompanyType = Company & { productCount?: number };

export type SearchDataResponse = Promise<{
    min: number;
    max: number;
    categories: CategoryType[];
    companies: CompanyType[];
}>;

export type SearchResult = Promise<{
    id: ProductId;
    name: string;
    source: "Category" | "Company" | "Product";
}>;
