import axios from "axios";
import type { TUploadedImage } from "../types/Category";
import type {
    TFilteredProductsParams,
    TProduct,
    TProductCatCom,
    TProductMutate,
    TProductWithImages,
    TRelatedProductFetchParams,
    TSearchDataParams,
    TSearchDataResponse,
    TSearchResult,
    TProductWithImgVariants,
} from "../types/Product";
import { FETCH_NUMBER, SEARCH_NUMBER } from "../utils/numbers";
import { objectToQueryString } from "../utils/objectQueryString";

export const getAllProducts = () => axios.get<TProduct[]>("/product");

export const createProduct = (input: Omit<TProductMutate, "id">) =>
    axios.post<void>("/product", input);

export const updateProduct = (input: TProductMutate) => {
    const { id, ...data } = input;
    return axios.patch<void>(`/product/${id}`, data);
};

export const deleteProduct = (id: Pick<TProduct, "id">["id"]) =>
    axios.delete<void>(`/product/${id}`);

export const uploadImages = (formData: FormData) =>
    axios.post<{ images: TUploadedImage[] }>(
        "/editor/upload-images",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

export const getFeaturedProducts = ({ pageParam = 0 }) => {
    return axios.get<TProductWithImages[]>(
        `/product/featured?limit=${FETCH_NUMBER}&offset=${
            pageParam * FETCH_NUMBER
        }`
    );
};

export const getRelatedProducts = ({
    fetchParams,
    pageParam,
}: {
    fetchParams: TRelatedProductFetchParams;
    pageParam: number;
}) => {
    const queryString = objectToQueryString(fetchParams);
    return axios.get<TProductWithImages[]>(
        `/product/related?limit=${FETCH_NUMBER}&offset=${
            pageParam * FETCH_NUMBER
        }&${queryString}`
    );
};

export const getPopularProducts = ({ pageParam = 0 }) =>
    axios.get<TProductWithImages[]>(
        `/product/popular?limit=${FETCH_NUMBER}&offset=${
            pageParam * FETCH_NUMBER
        }`
    );

export const getProductsById = (ids: Pick<TProduct, "id">["id"][]) => {
    if (!ids.length) return { data: [] as TProductWithImages[] };
    const query = ids.join(",");
    const queryIds = `?ids=${query}`;
    return axios.get<TProductWithImages[]>(`/product/some${queryIds}`);
};

export const getSingleProductById = (id: Pick<TProduct, "id">["id"]) =>
    axios.get<TProductWithImgVariants>(`/product/${id}`);

export const getSearchBarData = (query: string) =>
    axios.get<TSearchResult[]>(`/product/search?v=${query}`);

export const getSearchData = (input: TSearchDataParams) => {
    const queryString = objectToQueryString(input);
    return axios.get<TSearchDataResponse>(`/product/data?${queryString}`);
};

export const getFilteredProducts = ({
    fetchParams,
    pageParam,
}: {
    fetchParams: TFilteredProductsParams;
    pageParam: number;
}) => {
    const queryString = objectToQueryString(fetchParams);
    return axios.get<TProductCatCom[]>(
        `/product/filter?limit=${SEARCH_NUMBER}&offset=${
            pageParam * SEARCH_NUMBER
        }&${queryString}`
    );
};
