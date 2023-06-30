// import { useQuery } from "@apollo/client";
import { useState } from "react";
import ProductsGrid from "../../components/ProductsGrid";
// import {
//     GetRelatedProductsQuery,
//     GetSingleProductQuery,
// } from "../../generated/graphql";
import useInView from "../../hooks/useInView";
// import { QUERY_RELATED_PRODUCTS } from "../../queries1/Product";
import { FETCH_NUMBER } from "../../utils/numbers";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getRelatedProducts } from "../../queries/Product";
import { IProduct, IProductWithImages } from "../../types/Product";
import { AxiosError } from "axios";

const options = { root: null, rootMargin: "0px", treshold: 1.0 };

const RelatedProducts = ({ product }: { product: IProduct }) => {
    const fetchParams = {
        id: product?.id,
        company_id: product?.company_id,
        category_id: product?.category_id,
    };
    const {
        data: relatedProductData,
        isLoading: relatedProductLoading,
        error,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ["related"],
        queryFn: ({ pageParam = 0 }) =>
            getRelatedProducts({ fetchParams, pageParam }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.data.length % FETCH_NUMBER !== 0) return;
            return allPages.length;
        },
        keepPreviousData: true,
    });
    const relatedProductError = error as AxiosError;
    // const {
    //     data: relatedProductData,
    //     previousData,
    //     loading: relatedProductLoading,
    //     error: relatedProductError,
    //     fetchMore,
    // } = useQuery<GetRelatedProductsQuery>(QUERY_RELATED_PRODUCTS, {
    //     variables: {
    //         offset: 0,
    //         limit: FETCH_NUMBER,
    //         input: {
    //             id: product?.id,
    //             company_id: product?.company_id,
    //             category_id: product?.category_id,
    //         },
    //     },
    //     notifyOnNetworkStatusChange: true,
    //     onCompleted(data) {
    //         if (
    //             data.relatedProducts.length % FETCH_NUMBER !== 0 ||
    //             previousData?.relatedProducts.length ===
    //                 data.relatedProducts.length
    //         ) {
    //             setHasMore(0);
    //             return;
    //         }
    //         setHasMore((prev) => prev + 1);
    //     },
    // });

    const initialValue: IProductWithImages[] = [];
    const products = relatedProductData?.pages.reduce(
        (arr, curr) => arr.concat(curr.data),
        initialValue
    );

    const containerRef = useInView<HTMLDivElement>(
        options,
        fetchNextPage,
        hasNextPage
    );

    return (
        <>
            <ProductsGrid
                products={products}
                productLoading={relatedProductLoading}
                productError={relatedProductError}
            />
            <div ref={containerRef} />
        </>
    );
};

export default RelatedProducts;
