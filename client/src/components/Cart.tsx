import { BsPlus } from "@react-icons/all-files/bs/BsPlus";
import { FiMinus } from "@react-icons/all-files/fi/FiMinus";
import { AiOutlineDelete } from "@react-icons/all-files/ai/AiOutlineDelete";
import { BaseSyntheticEvent } from "react";
import { Button, Col, FormControl, Image, Modal, Row } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import {
	CartItem,
	ProductDBType,
	useCartContext,
} from "../context/CartContext";
import { toPriceNumber } from "../utils/numbers";
import { serverUrl } from "../utils/server";

const Cart = ({
	handleClose,
	show,
}: {
	handleClose: () => void;
	show: boolean;
}) => {
	const { cart, addProductToCart, removeProductFromCart } = useCartContext();
	const totalPrice = cart.reduce(
		(prev, curr) =>
			prev +
			((100 - curr.product.discount) / 100) * curr.amount * curr.product.price,
		0
	);

	const handleDecrease = (item: CartItem<ProductDBType>) => {
		addProductToCart({
			product: item.product,
			amount: item.amount === 1 ? 0 : -1,
		});
	};

	const handleIncrease = (item: CartItem<ProductDBType>) => {
		addProductToCart({
			product: item.product,
			amount: item.amount === item.product.inventory ? 0 : 1,
		});
	};

	const handleSetAmount = (
		e: BaseSyntheticEvent,
		item: CartItem<ProductDBType>
	) => {
		const setAmount = +e.target.value - item.amount;
		addProductToCart({
			product: item.product,
			amount:
				setAmount > item.product.inventory
					? item.product.inventory - item.amount
					: +e.target.value < 1
					? 1
					: setAmount,
		});
	};

	const handleCheckout = () => {
		const checkoutBody = cart.map((item) => {
			return { id: item.product.id, amount: item.amount };
		});
		console.log("body=", checkoutBody);

		fetch(`${serverUrl}/api/checkout`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(checkoutBody),
		})
			.then((res) => {
				if (res.ok) return res.json();
				return res.json().then((json) => Promise.reject(json));
			})
			.then(({ url }) => {
				window.open(url, "_self");
			})
			.catch((e) => {
				switch (e.type) {
					case "StripeCardError":
						console.log(`A payment error occurred: ${e.message}`);
						break;
					case "StripeInvalidRequestError":
						console.log("An invalid request occurred.");
						break;
					default:
						console.log("Another problem occurred, maybe unrelated to Stripe.");
						break;
				}
			});
	};

	return (
		<Modal
			className="fade"
			show={show}
			onHide={handleClose}
			centered
			scrollable
		>
			<Modal.Header closeButton>
				<Modal.Title>My Cart</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				{!!cart.length ? (
					<>
						{cart.map((item) => {
							return (
								<Row className="border-bottom pb-3 pt-3" key={uuidv4()}>
									<div className="d-flex justify-content-between mb-3">
										<div>{item.product.name}</div>
										<Button
											variant="link"
											onClick={() => removeProductFromCart(item.product)}
										>
											<AiOutlineDelete size={24} />
										</Button>
									</div>
									<Row className="justify-content-between align-items-center text-center gap-3">
										<Col sm={"4"}>
											<Image
												height={100}
												src={item.product.images[0].img_src}
											/>
										</Col>
										<Col sm={"2"} className="d-flex justify-content-center">
											<Button
												variant="link"
												className="text-decoration-none p-0"
												onClick={() => handleDecrease(item)}
											>
												<FiMinus size="2rem" />
											</Button>
											<FormControl
												type="text"
												className="p-0 ps-2 pe-2 text-center"
												style={{ width: "3rem" }}
												onChange={(e) => handleSetAmount(e, item)}
												value={item.amount}
											/>
											<Button
												variant="link"
												className="text-decoration-none p-0"
												onClick={() => handleIncrease(item)}
											>
												<BsPlus size="2rem" />
											</Button>
										</Col>
										<Col sm={"4"}>
											<div>
												{!!item.product.discount && (
													<s className="text-muted fs-5">{`${toPriceNumber(
														item.amount * item.product.price
													)} $`}</s>
												)}
											</div>
											<div
												className={
													item.product.discount
														? "text-danger fs-4 lh-1"
														: "fs-4 lh-1"
												}
											>
												{`${toPriceNumber(
													((100 - item.product.discount) / 100) *
														item.amount *
														item.product.price
												)} $`}
											</div>
										</Col>
									</Row>
								</Row>
							);
						})}
						<Row className="align-items-center mt-3">
							<Col className="fs-4">Total: {toPriceNumber(totalPrice)} $</Col>
							<Col className="text-end">
								<Button
									variant="success"
									onClick={handleCheckout}
									disabled={!cart.length}
								>
									Checkout
								</Button>
							</Col>
						</Row>
					</>
				) : (
					<div className="text-center fs-2">Cart is empty</div>
				)}
			</Modal.Body>
		</Modal>
	);
};

export default Cart;
