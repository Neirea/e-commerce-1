import axios from "axios";
import { IUploadedImage } from "../types/Category";
import {
    IProduct,
    IProductMutate,
    IProductWithImages,
    IRelatedProductFetchParams,
    ISearchResult,
    ProductWithImgVariants,
} from "../types/Product";
import { FETCH_NUMBER } from "../utils/numbers";

export const getAllProducts = () => axios.get<IProduct[]>("/product");

export const createProduct = (input: Omit<IProductMutate, "id">) =>
    axios.post<void>("/product", input);

export const updateProduct = (input: IProductMutate) => {
    const { id, ...data } = input;
    console.log(data);
    return axios.patch<void>(`/product/${id}`, data);
};

export const deleteProduct = (id: Pick<IProduct, "id">["id"]) =>
    axios.delete<void>(`/product/${id}`);

export const uploadImages = (formData: FormData) =>
    axios.post<{ images: IUploadedImage[] }>(
        "/editor/upload-images",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                // "csrf-token": user?.csrfToken || "",
            },
        }
    );

export const getFeaturedProducts = ({ pageParam = 0 }) => {
    return axios.get<IProductWithImages[]>(
        `/product/featured?limit=${FETCH_NUMBER}&offset=${
            pageParam * FETCH_NUMBER
        }`
    );
};

export const getRelatedProducts = ({
    fetchParams,
    pageParam,
}: {
    fetchParams: IRelatedProductFetchParams;
    pageParam: number;
}) => {
    return axios.get<IProductWithImages[]>(
        `/product/related?limit=${FETCH_NUMBER}&offset=${
            pageParam * FETCH_NUMBER
        }&id=${fetchParams.id}&company_id=${
            fetchParams.company_id
        }&category_id=${fetchParams.category_id}`
    );
};

export const getPopularProducts = ({ pageParam = 0 }) =>
    axios.get<IProductWithImages[]>(
        `/product/popular?limit=${FETCH_NUMBER}&offset=${
            pageParam * FETCH_NUMBER
        }`
    );

export const getProductsById = (ids: Pick<IProduct, "id">["id"][]) => {
    const query = ids.join(",");
    const queryIds = ids.length > 0 ? `?ids=${query}` : "";
    return axios.get<IProductWithImages[]>(`/product/some${queryIds}`);
};

export const getSingleProductById = (id: Pick<IProduct, "id">["id"]) =>
    axios.get<ProductWithImgVariants>(`/product/${id}`);

export const getSearchBarData = (query: string) =>
    axios.get<ISearchResult[]>(`/product/search?v=${query}`);
