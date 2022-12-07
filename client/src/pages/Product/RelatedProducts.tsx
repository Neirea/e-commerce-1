import { useQuery } from "@apollo/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import ProductsGrid from "../../components/ProductsGrid";
import {
    GetRelatedProductsQuery,
    GetSingleProductQuery,
} from "../../generated/graphql";
import { QUERY_RELATED_PRODUCTS } from "../../queries/Product";
import { FETCH_NUMBER } from "../../utils/numbers";
import useInView from "../../utils/useInView";

const options = { root: null, rootMargin: "0px", treshold: 1.0 };

const RelatedProducts = ({
    product,
}: {
    product: GetSingleProductQuery["product"];
}) => {
    const [hasMore, setHasMore] = useState(0); //number of pages, 0 - stop fetchingMore
    const {
        data: relatedProductData,
        previousData,
        loading: relatedProductLoading,
        error: relatedProductError,
        fetchMore,
    } = useQuery<GetRelatedProductsQuery>(QUERY_RELATED_PRODUCTS, {
        variables: {
            offset: 0,
            limit: FETCH_NUMBER,
            input: {
                id: product?.id,
                company_id: product?.company.id,
                category_id: product?.category.id,
            },
        },
        notifyOnNetworkStatusChange: true,
        onCompleted(data) {
            if (
                data.relatedProducts.length % FETCH_NUMBER !== 0 ||
                previousData?.relatedProducts.length ===
                    data.relatedProducts.length
            ) {
                setHasMore(0);
                return;
            }
            setHasMore((prev) => prev + 1);
        },
    });

    const containerRef = useInView<HTMLDivElement>(
        options,
        async () => {
            await fetchMore({
                variables: {
                    offset: relatedProductData?.relatedProducts.length,
                    limit: FETCH_NUMBER,
                    input: {
                        id: product?.id,
                        company_id: product?.company.id,
                        category_id: product?.category.id,
                    },
                },
            });
        },
        hasMore
    );

    return (
        <>
            <ProductsGrid
                products={relatedProductData?.relatedProducts}
                productLoading={relatedProductLoading}
                productError={relatedProductError}
            />
            <div ref={containerRef} />
        </>
    );
};

export default RelatedProducts;
