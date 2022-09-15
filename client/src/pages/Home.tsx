import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import MenuCard from "../components/MenuCard";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_ALL_CATEGORIES } from "../queries/Category";
import {
	GetAllCategoriesQuery,
	GetAllProductsQuery,
} from "../generated/graphql";
import { QUERY_ALL_PRODUCT } from "../queries/Product";

const Home = () => {
	const {
		data: categoryData,
		loading: categoryLoading,
		error: categoryError,
	} = useQuery<GetAllCategoriesQuery>(QUERY_ALL_CATEGORIES);

	const {
		data: productData,
		loading: productLoading,
		error: productError,
	} = useQuery<GetAllProductsQuery>(QUERY_ALL_PRODUCT);

	return (
		<>
			<Container as="main">
				<Container className="d-flex flex-column justify-content-center align-items-center  mt-5 mb-5 gap-3">
					<Row className="w-100">
						<Col className="col-7 p-0">
							<img
								src="https://res.cloudinary.com/dna5i1spz/image/upload/v1663072786/ecommerce-1/static/logo_left_abz14a.jpg"
								alt="First img"
								width="100%"
								height="100%"
								className="img-fit-cover"
							/>
						</Col>
						<Col className="bg-success col-5 p-5 d-flex flex-column justify-content-center">
							<h1 className="text-light fw-bold text-center fs-1">
								About Tech Shop
							</h1>
							<p className="text-light fs-4">
								Demo website to demonstrate a custom ecommerce flow. Listed
								products are not real and no payment information is collected.
							</p>
							<Link to="/search">
								<Button variant="light" className="w-100">
									Shop now
								</Button>
							</Link>
						</Col>
					</Row>
					<h2 className="text-center mt-3">Categories</h2>
					<Row className="gap-3">
						{categoryError ? (
							<Alert variant="danger">
								Error: data was not fetched from the server
							</Alert>
						) : categoryLoading ? (
							<div>Loading...</div>
						) : (
							categoryData &&
							categoryData.categories.map((category) => {
								if (category.img_src) {
									return (
										<Col key={`cat-${category.id}`}>
											<Card.Body className="text-center d-flex flex-column">
												<Card.Link
													as={Link}
													to={`/search?category=${category.name}`}
													className="custom-link"
												>
													<img
														className="mb-2"
														src={category.img_src}
														style={{ width: "15rem" }}
													/>
													<div>{category.name}</div>
												</Card.Link>
											</Card.Body>
										</Col>
									);
								}
							})
						)}
					</Row>
				</Container>

				<Container>
					<h2 className="text-center mt-5">Featured</h2>
					<Container className="d-flex justify-content-center mt-3 gap-3">
						<Row className="gap-3">
							{productError ? (
								<Alert variant="danger">
									Error: data was not fetched from the server
								</Alert>
							) : productLoading ? (
								// any: add loading animation with container height
								<div>Loading...</div>
							) : (
								productData &&
								productData.products?.map((product) => {
									if (product.images?.length) {
										return (
											<Col key={`prod-${product.id}`}>
												<Card.Body className="text-center d-flex flex-column">
													<Card.Link
														as={Link}
														className="custom-link"
														to={`/product/${product.id}`}
													>
														<img
															src={product.images[0].img_src}
															className="mb-2"
															style={{
																height: "15rem",
															}}
														/>
														<div>{product.name}</div>
													</Card.Link>
												</Card.Body>
											</Col>
										);
									}
								})
							)}
						</Row>
					</Container>
				</Container>
				<Container>
					<h2 className="text-center mt-5">Recommended</h2>
					<Container className="d-flex justify-content-center mt-3 gap-3">
						<Row className="gap-3">
							<Col>
								<MenuCard />
							</Col>
							<Col>
								<MenuCard />
							</Col>
							<Col>
								<MenuCard />
							</Col>
							<Col>
								<MenuCard />
							</Col>
							<Col>
								<MenuCard />
							</Col>
							<Col>
								<MenuCard />
							</Col>
						</Row>
					</Container>
				</Container>
			</Container>
		</>
	);
};

export default Home;
