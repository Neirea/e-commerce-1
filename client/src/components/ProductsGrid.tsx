import type { JSX } from "react";
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router";
import type { TProductWithImages } from "../types/Product";
import { toPriceNumber } from "../utils/numbers";

const ProductsGrid = ({
    products,
    productError,
    productLoading,
}: {
    products: TProductWithImages[] | undefined;
    productError: Error | undefined;
    productLoading: boolean;
}): JSX.Element => {
    if (productError) {
        return (
            <div className="d-flex justify-content-center">
                <Alert variant="danger">
                    Error: data was not fetched from the server
                </Alert>
            </div>
        );
    }

    return (
        <>
            <div className="d-grid justify-content-center justify-content-lg-start">
                {products &&
                    products.map((product) => {
                        return (
                            <div
                                key={product.id}
                                className={
                                    "d-flex justify-content-center mb-4" +
                                    (product.inventory <= 0
                                        ? " opacity-50"
                                        : "")
                                }
                            >
                                <div className="d-flex flex-column justify-content-between">
                                    <Link
                                        className="custom-link d-flex flex-column justify-content-center align-items-center text-center"
                                        to={`/product/${product.id}`}
                                    >
                                        {!!product.images?.length && (
                                            <img
                                                src={product.images[0].img_src}
                                                title={product.name}
                                                alt={product.name}
                                                loading="lazy"
                                                width={240}
                                                height={240}
                                                className="mb-2"
                                            />
                                        )}
                                        <div className="product-name">
                                            {product.name}
                                        </div>
                                    </Link>
                                    <div className="ps-3">
                                        {product.discount ? (
                                            <div>
                                                <s className="text-muted">
                                                    {toPriceNumber(
                                                        product.price,
                                                    )}
                                                    {" $"}
                                                </s>
                                            </div>
                                        ) : (
                                            <div className="empty-div" />
                                        )}
                                        <div
                                            className={
                                                product.discount
                                                    ? "text-danger fs-3 lh-1"
                                                    : "fs-3 lh-1"
                                            }
                                        >
                                            {toPriceNumber(
                                                ((100 - product.discount) /
                                                    100) *
                                                    product.price,
                                            )}
                                            {" $"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
            {products && productLoading && (
                <div style={{ height: "18.5rem" }} />
            )}
        </>
    );
};

export default ProductsGrid;
