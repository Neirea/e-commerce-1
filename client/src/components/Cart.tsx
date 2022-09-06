import {
	Modal,
	Button,
	Row,
	Col,
	Form,
	Image,
	FormControl,
} from "react-bootstrap";
import { BsPlus } from "@react-icons/all-files/bs/BsPlus";
import { FiMinus } from "@react-icons/all-files/fi/FiMinus";
import { useState, ChangeEvent } from "react";

const Cart = ({
	handleClose,
	show,
}: {
	handleClose: () => void;
	show: boolean;
}) => {
	const [amount, setAmount] = useState(0);
	const handleAmount = (e: ChangeEvent<HTMLInputElement>) => {
		setAmount(+e.target.value);
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
				<Row className="align-items-center text-center">
					<Col sm={"6"}>
						<p>Product Name</p>
						<Image
							fluid={true}
							src="https://content1.rozetka.com.ua/goods/images/big_tile/37361699.jpg"
						/>
					</Col>
					<Col sm={"3"} className="d-flex justify-content-center">
						<Button variant="link" className="text-decoration-none">
							<FiMinus size="2rem" />
						</Button>
						<FormControl
							type="text"
							className="p-0 ps-2 pe-2 text-center"
							style={{ width: "3rem" }}
							onChange={handleAmount}
							value={amount}
						/>
						<Button variant="link" className="text-decoration-none">
							<BsPlus size="2rem" />
						</Button>
					</Col>
					<Col sm={"3"} className="text-center">
						Price $
					</Col>
				</Row>
				<hr />
				{/* Total */}
				<Row className="justif-content-between align-items-center">
					<Col>Total Price: 1$</Col>
					<Col className="text-end">
						<Button variant="success">Checkout</Button>
					</Col>
				</Row>
			</Modal.Body>
		</Modal>
	);
};

export default Cart;
