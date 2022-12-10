import { BiCart } from "@react-icons/all-files/bi/BiCart";
import { useState } from "react";
import { Nav } from "react-bootstrap";
import useApolloCartStore from "../../../global/useApolloCartStore";
import CartContent from "./CartContent";

const Cart = () => {
    const { cart } = useApolloCartStore();
    const [showCart, setShowCart] = useState(false);
    // Cart Modal
    const handleShowCart = () => setShowCart(true);
    const handleCloseCart = () => setShowCart(false);

    const cartAmount = cart.reduce((prev, curr) => prev + curr.amount, 0);

    return (
        <>
            <Nav.Link
                onClick={handleShowCart}
                aria-label="open cart"
                className="position-relative"
            >
                <BiCart size={24} />
                {!!cartAmount && (
                    <div className="cart-amount">{cartAmount}</div>
                )}
            </Nav.Link>
            <CartContent handleClose={handleCloseCart} show={showCart} />
        </>
    );
};

export default Cart;
