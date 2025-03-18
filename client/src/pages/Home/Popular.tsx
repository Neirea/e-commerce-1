import { useInfiniteQuery } from "@tanstack/react-query";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import ProductsGrid from "../../components/ProductsGrid";
import { getPopularProducts } from "../../queries/Product";
import type { TProductWithImages } from "../../types/Product";
import { getError } from "../../utils/getError";
import { FETCH_NUMBER } from "../../utils/numbers";

const Popular = (): JSX.Element => {
    const {
        data: productData,
        isLoading: productLoading,
        error,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ["popular"],
        queryFn: getPopularProducts,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.data.length % FETCH_NUMBER !== 0) return;
            return allPages.length;
        },
        keepPreviousData: true,
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
            <h2 className="text-center mt-5 mb-5">Popular</h2>

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

export default Popular;
