import { ICategory, ICategoryType, IUploadedImage } from "./Category";
import { ICompany, ICompanyType } from "./Company";

export type IProduct = {
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
    variants: IProductWithImages[];
};

export type IProductUploadImage = IUploadedImage & {
    product_id: Pick<IProduct, "id">["id"];
};

export type IProductWithImages = IProduct & {
    images: IProductUploadImage[];
};

export type IProductCatCom = IProductWithImages & {
    company: ICompany;
    category: ICategory;
};

export type IProductMutate = Omit<
    IProduct,
    "created_at" | "updated_at" | "variants"
> & { variants: Pick<IProduct, "id">["id"][] };

export type ProductWithImgVariants = IProductWithImages & {
    company: ICompany;
    category: ICategory;
};

export type IRelatedProductFetchParams = {
    id: Pick<IProduct, "id">["id"];
    company_id: Pick<ICompany, "id">["id"];
    category_id: Pick<ICategory, "id">["id"];
};

export type ISearchResult = {
    id: Pick<IProduct, "id">["id"];
    name: string;
    source: "Category" | "Company" | "Product";
};

export type ISearchDataParams = {
    search_string?: string | (string | null)[] | null;
    company_id?: Pick<ICompany, "id">["id"];
    category_id?: Pick<ICategory, "id">["id"];
    min_price?: number;
    max_price?: number;
};

export type ISearchDataResponse = {
    min: number;
    max: number;
    categories: ICategoryType[];
    companies: ICompanyType[];
};

export type IFilteredProductsParams = {
    search_string?: string | (string | null)[] | null;
    company_id?: Pick<ICompany, "id">["id"];
    category_id?: Pick<ICategory, "id">["id"];
    min_price?: number;
    max_price?: number;
    sort_mode?: number;
};
