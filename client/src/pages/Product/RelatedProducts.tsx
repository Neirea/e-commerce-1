import { useInfiniteQuery } from "@tanstack/react-query";
import ProductsGrid from "../../components/ProductsGrid";
import useInView from "../../hooks/useInView";
import { getRelatedProducts } from "../../queries/Product";
import { IProduct, IProductWithImages } from "../../types/Product";
import { FETCH_NUMBER } from "../../utils/numbers";
import { getError } from "../../utils/getError";

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
    const relatedProductError = getError(error);

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
