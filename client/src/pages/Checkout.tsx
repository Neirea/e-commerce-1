import { useEffect } from "react";
import qs from "query-string";
import { useCartContext } from "../context/CartContext";

const Checkout = () => {
	const { clearCart } = useCartContext();
	const searchParams = qs.parse(location.search);

	useEffect(() => {
		if (searchParams.res === "success") {
			clearCart();
		}
	}, [searchParams]);

	if (searchParams.res === "success") {
		return (
			<main className="mt-5 p-5">
				<h2 className="text-center">Payment was successfuly received</h2>
			</main>
		);
	}
	if (searchParams.res === "cancel") {
		return (
			<main className="mt-5 p-5">
				<h2 className="text-center">Payment was canceled. Try again</h2>
			</main>
		);
	}
	return (
		<main className="mt-5 p-5">
			<h2 className="text-center">Bad response</h2>
		</main>
	);
};

export default Checkout;
