import qs from "query-string";
import Button from "react-bootstrap/Button";
import { useLocation, useNavigate } from "react-router-dom";
import useCurrentUser from "../hooks/useCurrentUser";

const OrderPayment = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const { user } = useCurrentUser();
    const searchParams = qs.parse(search);

    return (
        <main className="mt-5 p-5 d-flex gap-3 flex-column align-items-center">
            {searchParams.success === "true" ? (
                <h2>Payment was successfuly received</h2>
            ) : (
                <h2>Payment was canceled. Please try again</h2>
            )}
            {user && (
                <Button variant="success" onClick={() => navigate("/orders")}>
                    Your orders
                </Button>
            )}
        </main>
    );
};

export default OrderPayment;
