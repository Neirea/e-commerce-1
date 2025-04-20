import type { TCategory, TCategoryFull, TUploadedImage } from "./Category";
import type { TCompany, TCompanyFull } from "./Company";

export type TProduct = {
    id: number;
    name: string;
    price: number;
    description: object;
    inventory: number;
    company_id: number;
    category_id: number;
    shipping_cost: number;
    discount: number;
    created_at: Date;
    updated_at: Date;
    variants: TProductWithImages[];
};

export interface TProductUploadImage extends TUploadedImage {
    product_id: Pick<TProduct, "id">["id"];
}

export interface TProductWithImages extends TProduct {
    images: TProductUploadImage[];
}

export interface TProductCatCom extends TProductWithImages {
    company: TCompany;
    category: TCategory;
}

export interface TProductMutate
    extends Omit<TProduct, "created_at" | "updated_at" | "variants"> {
    variants: Pick<TProduct, "id">["id"][];
    img_id: string[];
    img_src: string[];
}

export interface TProductWithImgVariants extends TProductWithImages {
    company: TCompany;
    category: TCategory;
}

export type TRelatedProductFetchParams = {
    id: Pick<TProduct, "id">["id"];
    company_id: Pick<TCompany, "id">["id"];
    category_id: Pick<TCategory, "id">["id"];
};

export type TSearchResult = {
    id: Pick<TProduct, "id">["id"];
    name: string;
    source: "Category" | "Company" | "Product";
};

export type TSearchDataParams = {
    search_string?: string | (string | null)[] | null;
    company_id?: Pick<TCompany, "id">["id"];
    category_id?: Pick<TCategory, "id">["id"];
    min_price?: number;
    max_price?: number;
};

export type TSearchDataResponse = {
    min: number;
    max: number;
    categories: TCategoryFull[];
    companies: TCompanyFull[];
};

export type TFilteredProductsParams = {
    search_string?: string | (string | null)[] | null;
    company_id?: Pick<TCompany, "id">["id"];
    category_id?: Pick<TCategory, "id">["id"];
    min_price?: number;
    max_price?: number;
    sort_mode?: number;
};
