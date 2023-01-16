import { useQuery } from "@apollo/client";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Cart from "../../components/Header/Cart/CartContent";
import LoadingProgress from "../../components/LoadingProgress";
import { GetSingleProductQuery } from "../../generated/graphql";
import { GET_SINGLE_PRODUCT } from "../../queries/Product";
import AddProductForm from "./AddProductForm";
import RelatedProducts from "./RelatedProducts";

const ProductContent = () => {
    const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState(0);
    const [showCart, setShowCart] = useState(false);
    const { data, loading, error } = useQuery<GetSingleProductQuery>(
        GET_SINGLE_PRODUCT,
        { variables: { id: +id! } }
    );

    // Cart Modal
    const handleShowCart = () => setShowCart(true);
    const handleCloseCart = () => setShowCart(false);

    if (error || data?.product === null) {
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
            <LoadingProgress isLoading={loading} />
            <Row className="mt-5 mb-5">
                {!data?.product || loading ? (
                    <div style={{ height: "36.5rem" }} />
                ) : (
                    <>
                        <Col className="d-flex flex-column align-items-center mb-3">
                            {!!data.product.images?.length && (
                                <img
                                    style={{ height: "25rem" }}
                                    src={
                                        data.product.images[selectedImage]
                                            .img_src
                                    }
                                    alt={data.product.name}
                                />
                            )}
                            {/* show all images here */}
                            <div className="d-flex mt-3 gap-3">
                                {data.product.images?.map((img, idx) => {
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
                                                alt={data.product?.name}
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
                            <h2 className="mb-3">{data.product.name}</h2>
                            {Object.entries(data.product.description).map(
                                ([key, value]) => {
                                    return (
                                        <div className="lh-lg" key={key}>
                                            <b>{`${key}: `}</b>
                                            <span>{`${value}`}</span>
                                        </div>
                                    );
                                }
                            )}
                            {data.product.variants.length > 0 && (
                                <>
                                    <h4 className="mt-2">Other variants:</h4>

                                    <div className="d-flex gap-4">
                                        {data.product.variants.map(
                                            (product) => {
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
                                                                setSelectedImage(
                                                                    0
                                                                );
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
                                                                title={
                                                                    product.name
                                                                }
                                                                alt={
                                                                    product.name
                                                                }
                                                            />
                                                        </Link>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </>
                            )}
                            <AddProductForm
                                data={data}
                                handleShowCart={handleShowCart}
                            />
                        </Col>
                    </>
                )}
            </Row>
            <Cart handleClose={handleCloseCart} show={showCart} />
            <h2 className="mb-4 text-center">Related Products:</h2>
            {!!data?.product && <RelatedProducts product={data?.product} />}
        </Container>
    );
};

export default ProductContent;
