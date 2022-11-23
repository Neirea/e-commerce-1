import { useQuery } from "@apollo/client";
import { Alert, Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Loading from "../../components/Loading";
import { GetAllCategoriesQuery } from "../../generated/graphql";
import { QUERY_ALL_CATEGORIES } from "../../queries/Category";
import Featured from "./Featured";
import Popular from "./Popular";

const Home = () => {
    const {
        data: categoryData,
        loading: categoryLoading,
        error: categoryError,
    } = useQuery<GetAllCategoriesQuery>(QUERY_ALL_CATEGORIES);

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
                                width={740}
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
                            categoryData.categories.map((category) => {
                                if (category.img_src) {
                                    return (
                                        <Col
                                            key={uuidv4()}
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
                            <div style={{ height: "18.5rem" }}>
                                <Loading />
                            </div>
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
