import { useQuery } from "@apollo/client";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Cart from "../../components/Cart";
import { useCartContext } from "../../context/CartContext";
import { GetSingleProductQuery } from "../../generated/graphql";
import { GET_SINGLE_PRODUCT } from "../../queries/Product";
import { toPriceNumber } from "../../utils/numbers";
import RelatedProducts from "./RelatedProducts";

const Product = () => {
	const { id } = useParams();
	const { addProductToCart } = useCartContext();
	const [selectedImage, setSelectedImage] = useState(0);
	const [showCart, setShowCart] = useState(false);
	const [amount, setAmount] = useState(1);
	const { data, loading, error } = useQuery<GetSingleProductQuery>(
		GET_SINGLE_PRODUCT,
		{ variables: { id: +id! } }
	);

	//reset amount when product changes
	useEffect(() => {
		if (id) {
			setAmount(1);
		}
	}, [id]);

	const handleAmount = (e: ChangeEvent<HTMLInputElement>) => {
		setAmount(+e.target.value);
	};

	// Cart Modal
	const handleShowCart = () => setShowCart(true);
	const handleCloseCart = () => setShowCart(false);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		// add to cart variable

		if (data?.product) {
			addProductToCart({ product: data.product, amount: amount });
		}
		// open cart modal
		handleShowCart();
	};

	if (error || data?.product === null) {
		return (
			<Container as="main" className="d-flex justify-content-center flex-row">
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
			<Row className="mt-5 mb-5">
				{!data?.product || loading ? (
					<div style={{ height: "36.5rem" }} />
				) : (
					<>
						<Col className="d-flex flex-column align-items-center mb-3">
							{!!data.product.images?.length && (
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
							{!!data.product.variants.length && (
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
										<div className="d-flex gap-3 align-items-center">
											<div>
												{!!data.product.discount && (
													<s className="text-muted fs-5">{`${toPriceNumber(
														amount * data.product.price
													)} $`}</s>
												)}
											</div>
											<div
												className={
													data.product.discount
														? "text-danger fs-3 lh-1"
														: "fs-3 lh-1"
												}
											>
												{`${toPriceNumber(
													((100 - data.product.discount) / 100) *
														amount *
														data.product.price
												)} $`}
											</div>
										</div>
									</Col>
								</Row>
								<Button
									type="submit"
									variant="success"
									disabled={!data.product.inventory}
									style={{ width: "10rem" }}
								>
									Add to Cart
								</Button>
							</Form>
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

export default Product;
