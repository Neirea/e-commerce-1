import axios from "axios";
import { IUploadedImage } from "../types/Category";
import {
    IFilteredProductsParams,
    IProduct,
    IProductCatCom,
    IProductMutate,
    IProductWithImages,
    IRelatedProductFetchParams,
    ISearchDataParams,
    ISearchDataResponse,
    ISearchResult,
    ProductWithImgVariants,
} from "../types/Product";
import { FETCH_NUMBER, SEARCH_NUMBER } from "../utils/numbers";
import { objectToQueryString } from "../utils/objectQueryString";

export const getAllProducts = () => axios.get<IProduct[]>("/product");

export const createProduct = (input: Omit<IProductMutate, "id">) =>
    axios.post<void>("/product", input);

export const updateProduct = (input: IProductMutate) => {
    const { id, ...data } = input;
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
    const queryString = objectToQueryString(fetchParams);
    return axios.get<IProductWithImages[]>(
        `/product/related?limit=${FETCH_NUMBER}&offset=${
            pageParam * FETCH_NUMBER
        }&${queryString}`
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

export const getSearchData = (input: ISearchDataParams) => {
    const queryString = objectToQueryString(input);
    return axios.get<ISearchDataResponse>(`/product/data?${queryString}`);
};

export const getFilteredProducts = ({
    fetchParams,
    pageParam,
}: {
    fetchParams: IFilteredProductsParams;
    pageParam: number;
}) => {
    const queryString = objectToQueryString(fetchParams);
    return axios.get<IProductCatCom[]>(
        `/product/filter?limit=${SEARCH_NUMBER}&offset=${
            pageParam * SEARCH_NUMBER
        }&${queryString}`
    );
};