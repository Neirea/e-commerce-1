import { useQuery } from "@apollo/client";
import { useState } from "react";
import ProductsGrid from "../../components/ProductsGrid";
import {
    GetRelatedProductsQuery,
    GetSingleProductQuery,
} from "../../generated/graphql";
import { QUERY_RELATED_PRODUCTS } from "../../queries/Product";
import { FETCH_NUMBER } from "../../utils/numbers";
import useInView from "../../utils/useInView";

const RelatedProducts = ({
    product,
}: {
    product: GetSingleProductQuery["product"];
}) => {
    const [hasMore, setHasMore] = useState(true);
    const {
        data: relatedProductData,
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
    });

    const containerRef = useInView<HTMLDivElement>(
        {
            root: null,
            rootMargin: "0px",
            treshold: 1.0,
        },
        async () => {
            if (
                relatedProductData?.relatedProducts &&
                relatedProductData.relatedProducts.length % FETCH_NUMBER ===
                    0 &&
                hasMore
            ) {
                const result = await fetchMore({
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
                if (result.data.relatedProducts.length === 0) {
                    setHasMore(false);
                }
            }
        }
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
