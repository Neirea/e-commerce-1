import { useApolloClient, useQuery } from "@apollo/client";
import { useEffect } from "react";
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
    });
    const { cache } = useApolloClient();

    const { containerRef, isVisible } = useInView<HTMLDivElement>({
        root: null,
        rootMargin: "0px",
        treshold: 1.0,
    });

    useEffect(() => {
        if (isVisible) {
            (async () => {
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
            })();
        }
    }, [isVisible]);

    useEffect(() => {
        return () => {
            if (product?.id) {
                //invalidate cache if swap on other product
                cache.evict({ id: "ROOT_QUERY", fieldName: "relatedProducts" });
            }
        };
    }, [product?.id]);

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
