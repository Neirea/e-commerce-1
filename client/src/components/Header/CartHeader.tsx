import { BiCart } from "@react-icons/all-files/bi/BiCart";
import { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import useCartStore, { CartType } from "../../context/useStore";
import Cart from "../Cart";

const CartHeader = () => {
    const { cart, syncCart } = useCartStore(({ cart, syncCart }) => ({
        cart,
        syncCart,
    }));
    const [showCart, setShowCart] = useState(false);
    // Cart Modal
    const handleShowCart = () => setShowCart(true);
    const handleCloseCart = () => setShowCart(false);

    const cartAmount = cart.reduce((prev, curr) => prev + curr.amount, 0);

    useEffect(() => {
        const localCart: CartType = JSON.parse(
            localStorage.getItem("cart") || "[]"
        );
        syncCart(localCart);
    }, []);

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
            <Cart handleClose={handleCloseCart} show={showCart} />
        </>
    );
};

export default CartHeader;
