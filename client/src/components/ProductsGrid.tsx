import { ApolloError } from "@apollo/client";
import { Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Product } from "../generated/graphql";
import { toPriceNumber } from "../utils/numbers";
import Loading from "./Loading";

type ProductType = Pick<
    Product,
    "id" | "name" | "price" | "inventory" | "discount"
> & { images: Array<Pick<Product["images"][number], "img_src">> };

const ProductsGrid = ({
    products,
    productError,
    productLoading,
}: {
    products: Array<ProductType> | undefined;
    productError: ApolloError | undefined;
    productLoading: boolean;
}) => {
    if (productError) {
        return (
            <div className="d-flex justify-content-center">
                <Alert variant="danger">
                    Error: data was not fetched from the server
                </Alert>
            </div>
        );
    }
    if (!products) {
        return (
            <div style={{ height: "18.5rem" }}>
                <Loading />
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
                                className="d-flex justify-content-center mb-4"
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
                                                        product.price
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
                                                    product.price
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
                <div style={{ height: "18.5rem" }}>
                    <Loading />
                </div>
            )}
        </>
    );
};

export default ProductsGrid;
