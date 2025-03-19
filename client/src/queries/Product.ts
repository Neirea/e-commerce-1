import axios, { type AxiosResponse } from "axios";
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

export const getAllProducts = (): Promise<AxiosResponse<TProduct[], any>> =>
    axios.get("/product");

export const createProduct = (
    input: Omit<TProductMutate, "id">,
): Promise<AxiosResponse<void, any>> => axios.post("/product", input);

export const updateProduct = (
    input: TProductMutate,
): Promise<AxiosResponse<void, any>> => {
    const { id, ...data } = input;
    return axios.patch(`/product/${id}`, data);
};

export const deleteProduct = (
    id: Pick<TProduct, "id">["id"],
): Promise<AxiosResponse<void, any>> => axios.delete(`/product/${id}`);

export const uploadImages = (
    formData: FormData,
): Promise<
    AxiosResponse<
        {
            images: TUploadedImage[];
        },
        any
    >
> =>
    axios.post("/editor/upload-images", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

export const getFeaturedProducts = ({
    pageParam,
}): Promise<AxiosResponse<TProductWithImages[]>> => {
    return axios.get(
        `/product/featured?limit=${FETCH_NUMBER}&offset=${
            pageParam * FETCH_NUMBER
        }`,
    );
};

export const getRelatedProducts = ({
    fetchParams,
    pageParam,
}: {
    fetchParams: TRelatedProductFetchParams;
    pageParam: number;
}): Promise<AxiosResponse<TProductWithImages[]>> => {
    const queryString = objectToQueryString(fetchParams);
    return axios.get(
        `/product/related?limit=${FETCH_NUMBER}&offset=${
            pageParam * FETCH_NUMBER
        }&${queryString}`,
    );
};

export const getPopularProducts = ({
    pageParam,
}): Promise<AxiosResponse<TProductWithImages[]>> =>
    axios.get(
        `/product/popular?limit=${FETCH_NUMBER}&offset=${pageParam * FETCH_NUMBER}`,
    );

export const getProductsById = (
    ids: Pick<TProduct, "id">["id"][],
): Promise<AxiosResponse<TProductWithImages[]>> => {
    if (!ids.length)
        return Promise.resolve({
            data: [] as TProductWithImages[],
        } as AxiosResponse<TProductWithImages[]>);
    const query = ids.join(",");
    const queryIds = `?ids=${query}`;
    return axios.get(`/product/some${queryIds}`);
};

export const getSingleProductById = (
    id: Pick<TProduct, "id">["id"],
): Promise<AxiosResponse<TProductWithImgVariants>> =>
    axios.get(`/product/${id}`);

export const getSearchBarData = (
    query: string,
): Promise<AxiosResponse<TSearchResult[]>> =>
    axios.get(`/product/search?v=${query}`);

export const getSearchData = (
    input: TSearchDataParams,
): Promise<AxiosResponse<TSearchDataResponse>> => {
    const queryString = objectToQueryString(input);
    return axios.get(`/product/data?${queryString}`);
};

export const getFilteredProducts = ({
    fetchParams,
    pageParam,
}: {
    fetchParams: TFilteredProductsParams;
    pageParam: number;
}): Promise<AxiosResponse<TProductCatCom[]>> => {
    const queryString = objectToQueryString(fetchParams);
    return axios.get(
        `/product/filter?limit=${SEARCH_NUMBER}&offset=${
            pageParam * SEARCH_NUMBER
        }&${queryString}`,
    );
};
