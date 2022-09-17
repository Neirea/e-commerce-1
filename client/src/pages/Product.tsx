import { useQuery } from "@apollo/client";
import { ChangeEvent, FormEvent, useState } from "react";
import { Container, Row, Col, Alert, Form, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import {
	GetAllProductsQuery,
	GetSingleProductQuery,
} from "../generated/graphql";
import { GET_SINGLE_PRODUCT, QUERY_ALL_PRODUCT } from "../queries/Product";

const Product = () => {
	const { id } = useParams();
	const [selectedImage, setSelectedImage] = useState(0);
	const [amount, setAmount] = useState(1);
	const { data, loading, error } = useQuery<GetSingleProductQuery>(
		GET_SINGLE_PRODUCT,
		{ variables: { id: +id! } }
	);
	const {
		data: productData,
		loading: productLoading,
		error: productError,
	} = useQuery<GetAllProductsQuery>(QUERY_ALL_PRODUCT);

	const handleAmount = (e: ChangeEvent<HTMLInputElement>) => {
		setAmount(+e.target.value);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		// add to cart variable
		// open cart modal
	};

	if (error) {
		return (
			<Container as="main" className="d-flex justify-content-center flex-row">
				<Alert variant="danger" className="mt-5 text-center w-50 h-100">
					<Alert.Heading as="h1">Error</Alert.Heading>
					<p>
						{"Failed to fetch product with id:"}{" "}
						<b className="fs-5">{`${id}`}</b>
					</p>
				</Alert>
			</Container>
		);
	}

	return (
		<Container as="main">
			<Row className="mt-5 mb-5">
				{!data?.product || loading ? (
					<div style={{ height: "36.5rem" }} />
				) : (
					<>
						<Col className="d-flex flex-column align-items-center">
							{data.product.images?.length && (
								<img
									style={{ height: "25rem" }}
									src={data.product.images[selectedImage].img_src}
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
											style={{ height: "7rem", width: "7rem" }}
										>
											<img
												src={img.img_src}
												alt={data.product?.name}
												style={{ height: "100%" }}
												onClick={() => setSelectedImage(idx)}
											/>
										</div>
									);
								})}
							</div>
						</Col>
						<Col>
							<h2 className="mb-3">{data.product.name}</h2>
							{Object.entries(data.product.description).map(([key, value]) => {
								return (
									<div className="lh-lg" key={key}>
										<b>{`${key}: `}</b>
										<span>{`${value}`}</span>
									</div>
								);
							})}
							<h4 className="mt-2">Other variants:</h4>
							{data.product.variants.map((product) => {
								return (
									<div
										key={`v-${product.id}`}
										style={{ height: "7rem", width: "7rem" }}
									>
										<Link
											className="text-center"
											to={`/product/${product.id}`}
											onClick={() => {
												setSelectedImage(0);
											}}
										>
											<img
												src={product.images[0].img_src}
												style={{ height: "100%" }}
												title={product.name}
												alt={product.name}
											/>
										</Link>
									</div>
								);
							})}
							<Form onSubmit={handleSubmit}>
								<Row className="d-flex justify-content-between align-items-center gap-3 pt-3 mb-4">
									<Col>
										<Form.Control
											className="w-25"
											type="number"
											value={amount}
											min={1}
											max={data.product.inventory}
											onChange={handleAmount}
										/>
									</Col>
									<Col className="fs-3">
										<div className="d-flex gap-3">
											<div>
												{data.product.discount && (
													<s className="text-muted fs-5">{`${
														amount * data.product.price
													} $`}</s>
												)}
											</div>
											<div>
												<b>
													{`${Math.floor(
														((100 - data.product.discount) / 100) *
															amount *
															data.product.price
													)} $`}
												</b>
											</div>
										</div>
									</Col>
								</Row>
								<Button type="submit" variant="success" className="w-25">
									Add to Cart
								</Button>
							</Form>
						</Col>
					</>
				)}
			</Row>

			<Row>
				{!productData || productLoading ? (
					<div style={{ height: "18.5rem" }}>
						<Loading />
					</div>
				) : (
					<Col>
						<h2 className="mb-4 text-center">Related Products:</h2>
						{/* fix to show as grid any (to do same in Home) */}

						{productError ? (
							<Alert variant="danger">Failed to fetch products</Alert>
						) : (
							<div className="d-flex justify-content-center align-items-center gap-3 flex-wrap">
								{productData &&
									productData.products?.map((product) => {
										if (product.images?.length) {
											return (
												<Col key={`prod-${product.id}`}>
													<div className="text-center d-flex flex-column">
														<Link
															className="custom-link"
															to={`/product/${product.id}`}
														>
															<img
																src={product.images[0].img_src}
																alt={product.name}
																title={product.name}
																className="mb-2"
																style={{
																	height: "15rem",
																}}
															/>
															<div>{product.name}</div>
														</Link>
													</div>
												</Col>
											);
										}
									})}
							</div>
						)}
					</Col>
				)}
			</Row>
		</Container>
	);
};

export default Product;
