import { useQuery } from "@tanstack/react-query";
import { Alert, Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAllCategories } from "../../queries/Category";
import Featured from "./Featured";
import Popular from "./Popular";
import { getError } from "../../utils/getError";

const Home = () => {
    const {
        data: categoryData,
        isLoading: categoryLoading,
        error,
    } = useQuery({
        queryKey: ["category"],
        queryFn: getAllCategories,
    });
    const categoryError = getError(error);

    return (
        <>
            <Container as="main">
                <Container
                    as="section"
                    className="d-flex flex-column justify-content-center align-items-center  mt-5 mb-5 gap-3"
                >
                    <Row className="w-100">
                        <Col className="col-7 p-0 d-none d-lg-block">
                            <img
                                src="https://res.cloudinary.com/dna5i1spz/image/upload/v1667474975/ecommerce-1/static/logo_left_dqui4i.jpg"
                                alt="First img"
                                className="img-fit-cover"
                                loading="lazy"
                                width={742}
                                height={410}
                            />
                        </Col>
                        <Col className="bg-success col-lg-5 p-5 d-flex flex-column justify-content-center">
                            <h1 className="text-light fw-bold text-center fs-1">
                                About Techway
                            </h1>
                            <p className="text-light fs-4">
                                Demo website to demonstrate a custom ecommerce
                                flow. Listed products are not real and no
                                payment information is collected. Do not use
                                your real personal or payment information.
                            </p>
                            <Link to="/search">
                                <Button variant="light" className="w-100">
                                    Shop now
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                    <h2 className="text-center mt-3">Categories</h2>
                    <Row>
                        {categoryError ? (
                            <Alert variant="danger">
                                Error: data was not fetched from the server
                            </Alert>
                        ) : categoryData && !categoryLoading ? (
                            categoryData.data?.map((category) => {
                                if (category.img_src) {
                                    return (
                                        <Col
                                            key={category.id}
                                            className="d-flex justify-content-center mb-4"
                                        >
                                            <div style={{ width: "15rem" }}>
                                                <Link
                                                    to={`/search?c=${category.id}`}
                                                    className="custom-link d-flex flex-column justify-content-center align-items-center text-center"
                                                >
                                                    <img
                                                        className="mb-2"
                                                        src={category.img_src}
                                                        title={category.name}
                                                        alt={category.name}
                                                        width={240}
                                                        height={240}
                                                    />
                                                    <div>{category.name}</div>
                                                </Link>
                                            </div>
                                        </Col>
                                    );
                                }
                            })
                        ) : (
                            <div style={{ height: "18.5rem" }} />
                        )}
                    </Row>
                </Container>
                <Featured />
                <Popular />
            </Container>
        </>
    );
};

export default Home;
