import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import Categories from "./Categories";
import Featured from "./Featured";
import Popular from "./Popular";

const Home = () => {
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
                    <Row
                        className="d-flex flex-column justify-content-center align-items-center"
                        style={{ minHeight: "18.5rem" }}
                    >
                        <Categories />
                    </Row>
                </Container>
                <Featured />
                <Popular />
            </Container>
        </>
    );
};

export default Home;
