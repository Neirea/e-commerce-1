import { BiCart } from "@react-icons/all-files/bi/BiCart";
import { useState, type JSX } from "react";
import Nav from "react-bootstrap/Nav";
import useCartStore from "../../../store/useCartStore";
import CartContent from "./CartContent";

const Cart = (): JSX.Element => {
    const { cart } = useCartStore();
    const [showCart, setShowCart] = useState(false);
    const handleShowCart = (): void => setShowCart(true);
    const handleCloseCart = (): void => setShowCart(false);

    const cartAmount = cart.reduce((prev, curr) => prev + curr.amount, 0);

    return (
        <>
            <Nav.Link
                onClick={handleShowCart}
                aria-label="open cart"
                className="position-relative"
            >
                <BiCart size={24} />
                {cartAmount > 0 && (
                    <div className="cart-amount">{cartAmount}</div>
                )}
            </Nav.Link>
            <CartContent handleClose={handleCloseCart} show={showCart} />
        </>
    );
};

export default Cart;
