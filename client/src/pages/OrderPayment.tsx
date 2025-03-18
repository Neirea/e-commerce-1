import qs from "query-string";
import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import { useLocation, useNavigate } from "react-router-dom";
import useCurrentUser from "../hooks/useCurrentUser";
import useCartStore from "../store/useCartStore";

const OrderPayment = (): JSX.Element => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const { user } = useCurrentUser();
    const { cart, clearCart } = useCartStore();
    const searchParams = qs.parse(search);

    useEffect(() => {
        if (
            searchParams.redirect_status === "succeeded" &&
            searchParams.payment_intent_client_secret &&
            searchParams.payment_intent &&
            cart.length > 0
        ) {
            clearCart();
        }
    }, [search, cart]);

    return (
        <main className="mt-5 p-5 d-flex gap-3 flex-column align-items-center">
            <h2>Payment was successfuly received</h2>
            {user && (
                <Button
                    variant="success"
                    onClick={() => void navigate("/orders")}
                >
                    Your orders
                </Button>
            )}
        </main>
    );
};

export default OrderPayment;
