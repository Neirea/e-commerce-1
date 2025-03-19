import { useQuery } from "@tanstack/react-query";
import { useState, type JSX } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Link, useParams } from "react-router";
import Cart from "../../components/Header/Cart/CartContent";
import LoadingProgress from "../../components/LoadingProgress";
import { getSingleProductById } from "../../queries/Product";
import AddProductForm from "./AddProductForm";
import RelatedProducts from "./RelatedProducts";

const Product = (): JSX.Element => {
    const { id: idParam } = useParams();
    const [selectedImage, setSelectedImage] = useState(0);
    const [showCart, setShowCart] = useState(false);
    const id = idParam != null ? +idParam : 0;
    const {
        data: currentData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["product", id],
        queryFn: () => getSingleProductById(id),
    });

    const product = currentData?.data;

    const handleShowCart = (): void => setShowCart(true);
    const handleCloseCart = (): void => setShowCart(false);

    if (error) {
        return (
            <Container
                as="main"
                className="d-flex justify-content-center flex-row"
            >
                <div className="mt-5 text-center">
                    <h1 className="text-danger">Error</h1>
                    <h3 className="mt-3">
                        {"Failed to fetch product with id:"} <b>{`${id}`}</b>
                    </h3>
                </div>
            </Container>
        );
    }

    return (
        <Container as="main">
            <LoadingProgress isLoading={isLoading} />
            <Row className="mt-5 mb-5">
                {!product ? (
                    <div style={{ height: "36.5rem" }} />
                ) : (
                    <>
                        <Col className="d-flex flex-column align-items-center mb-3">
                            {!!product.images?.length && (
                                <img
                                    style={{ height: "25rem" }}
                                    src={product.images[selectedImage].img_src}
                                    alt={product.name}
                                />
                            )}
                            <div className="d-flex mt-3 gap-3">
                                {product.images?.map((img, idx) => {
                                    return (
                                        <div
                                            className={
                                                selectedImage === idx
                                                    ? "text-center border border-dark"
                                                    : "text-center"
                                            }
                                            key={img.img_id}
                                            style={{
                                                height: "7rem",
                                                width: "7rem",
                                            }}
                                        >
                                            <img
                                                src={img.img_src}
                                                alt={product?.name}
                                                style={{
                                                    height: "100%",
                                                    width: "100%",
                                                }}
                                                onClick={() =>
                                                    setSelectedImage(idx)
                                                }
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </Col>
                        <Col>
                            <h2 className="mb-3">{product.name}</h2>
                            {Object.entries(product.description).map(
                                ([key, value]) => {
                                    return (
                                        <div className="lh-lg" key={key}>
                                            <b>{`${key}: `}</b>
                                            <span>{`${value}`}</span>
                                        </div>
                                    );
                                },
                            )}
                            {product.variants.length > 0 && (
                                <>
                                    <h4 className="mt-2">Other variants:</h4>

                                    <div className="d-flex gap-4">
                                        {product.variants.map((product) => {
                                            return (
                                                <div
                                                    key={product.id}
                                                    style={{
                                                        height: "7rem",
                                                    }}
                                                >
                                                    <Link
                                                        className="text-center"
                                                        to={`/product/${product.id}`}
                                                        onClick={() => {
                                                            setSelectedImage(0);
                                                        }}
                                                    >
                                                        <img
                                                            src={
                                                                product
                                                                    .images[0]
                                                                    .img_src
                                                            }
                                                            style={{
                                                                height: "100%",
                                                            }}
                                                            title={product.name}
                                                            alt={product.name}
                                                        />
                                                    </Link>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                            <AddProductForm
                                product={product}
                                handleShowCart={handleShowCart}
                            />
                        </Col>
                    </>
                )}
            </Row>
            <Cart handleClose={handleCloseCart} show={showCart} />
            <h2 className="mb-4 text-center">Related Products:</h2>
            {!!product && <RelatedProducts key={id} product={product} />}
        </Container>
    );
};

export default Product;
