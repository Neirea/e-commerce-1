import { useQuery } from "@apollo/client";
import { ChangeEvent, FormEvent, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ProductsGrid from "../components/ProductsGrid";
import {
	GetRelatedProductsQuery,
	GetSingleProductQuery,
} from "../generated/graphql";
import { GET_SINGLE_PRODUCT, QUERY_RELATED_PRODUCTS } from "../queries/Product";

const FETCH_NUMBER = 5;

const Product = () => {
	const { id } = useParams();
	const [selectedImage, setSelectedImage] = useState(0);
	const [amount, setAmount] = useState(1);
	const { data, loading, error } = useQuery<GetSingleProductQuery>(
		GET_SINGLE_PRODUCT,
		{ variables: { id: +id! } }
	);

	const isSkip = data?.product === undefined;
	const {
		data: relatedProductData,
		loading: relatedProductLoading,
		error: relatedProductError,
		fetchMore,
	} = useQuery<GetRelatedProductsQuery>(QUERY_RELATED_PRODUCTS, {
		variables: {
			input: {
				limit: FETCH_NUMBER,
				offset: 0,
				company_id: data?.product?.company.id,
				category_id: data?.product?.category.id,
			},
		},
		skip: isSkip,
	});
	const [showMore, setShowMore] = useState(true);

	const handleAmount = (e: ChangeEvent<HTMLInputElement>) => {
		setAmount(+e.target.value);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		// add to cart variable
		// open cart modal
	};

	// const fetchMoreProducts = async () => {
	// 	await fetchMore({
	// 		variables: {
	// 			offset: relatedProductData?.relatedProducts.length,
	// 			limit: FETCH_NUMBER,
	// 		},
	// 		updateQuery(prev, { fetchMoreResult }) {
	// 			if (!fetchMoreResult.relatedProducts.length) {
	// 				setShowMore(false);
	// 				return prev;
	// 			}
	// 			if (fetchMoreResult.relatedProducts.length < FETCH_NUMBER) {
	// 				setShowMore(false);
	// 			}
	// 			return Object.assign({}, prev, {
	// 				featuredProducts: [
	// 					...prev.relatedProducts,
	// 					...fetchMoreResult.relatedProducts,
	// 				],
	// 			});
	// 		},
	// 	});
	// };

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
									<div className="lh-lg" key={uuidv4()}>
										<b>{`${key}: `}</b>
										<span>{`${value}`}</span>
									</div>
								);
							})}
							{data.product.variants.length > 0 && (
								<>
									<h4 className="mt-2">Other variants:</h4>

									<div className="d-flex gap-4">
										{data.product.variants.map((product) => {
											return (
												<div key={uuidv4()} style={{ height: "7rem" }}>
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
									</div>
								</>
							)}
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
			<h2 className="mb-4 text-center">Related Products:</h2>
			<ProductsGrid
				currentProduct={data?.product}
				products={relatedProductData?.relatedProducts}
				productLoading={relatedProductLoading}
				productError={relatedProductError}
			/>
		</Container>
	);
};

export default Product;
