import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import type { JSX } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import ProductsGrid from "../../components/ProductsGrid";
import { getFeaturedProducts } from "../../queries/Product";
import type { TProductWithImages } from "../../types/Product";
import { getError } from "../../utils/getError";
import { FETCH_NUMBER } from "../../utils/numbers";

const Featured = (): JSX.Element => {
    const {
        data: productData,
        isLoading: productLoading,
        error,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ["featured"],
        queryFn: getFeaturedProducts,
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.data.length % FETCH_NUMBER !== 0) return;
            return allPages.length;
        },
        placeholderData: keepPreviousData,
    });
    const productError = getError(error);
    const fetchMoreProducts = (): void => {
        void fetchNextPage();
    };
    const initialValue: TProductWithImages[] = [];
    const products = productData?.pages.reduce(
        (arr, curr) => arr.concat(curr.data),
        initialValue,
    );

    return (
        <Container as="section" className="mt-3 gap-3">
            <h2 className="text-center mt-5 mb-5">Featured</h2>
            <ProductsGrid
                products={products}
                productLoading={productLoading}
                productError={productError}
            />
            {hasNextPage && (
                <div className="text-center mt-3">
                    <Button
                        size="lg"
                        variant={"outline-success"}
                        className="w-25 fs-6"
                        onClick={fetchMoreProducts}
                    >
                        Load More
                    </Button>
                </div>
            )}
        </Container>
    );
};

export default Featured;
