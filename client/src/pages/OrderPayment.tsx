import qs from "query-string";
import { useCartContext } from "../context/CartContext";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const OrderPayment = () => {
	const navigate = useNavigate();
	const searchParams = qs.parse(location.search);

	return (
		<main className="mt-5 p-5 d-flex gap-3 flex-column align-items-center">
			{searchParams.success === "true" ? (
				<h2>Payment was successfuly received</h2>
			) : (
				<h2>Payment was canceled. Go to your order to try again</h2>
			)}
			<Button variant="success" onClick={() => navigate("/orders")}>
				Your orders
			</Button>
		</main>
	);
};

export default OrderPayment;
