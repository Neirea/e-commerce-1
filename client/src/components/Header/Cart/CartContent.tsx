import { AiOutlineDelete } from "@react-icons/all-files/ai/AiOutlineDelete";
import { BsPlus } from "@react-icons/all-files/bs/BsPlus";
import { FiMinus } from "@react-icons/all-files/fi/FiMinus";
import { type ChangeEvent, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import { useLocation, useNavigate } from "react-router-dom";
import { getProductsById } from "../../../queries/Product";
import type { TCartItem } from "../../../store/useCartStore";
import useCartStore from "../../../store/useCartStore";
import type { TProductWithImages } from "../../../types/Product";
import { getDiscountPrice } from "../../../utils/getDiscountedPrice";
import { toPriceNumber } from "../../../utils/numbers";
import ItemPrice from "../../ItemPrice";

const CartContent = ({
    handleClose,
    show,
}: {
    handleClose: () => void;
    show: boolean;
}): JSX.Element => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const { cart, addProductToCart, removeProductFromCart, syncCart } =
        useCartStore();
    const totalPrice = cart.reduce(
        (prev, curr) =>
            prev +
            getDiscountPrice(curr.product.price, curr.product.discount) *
                curr.amount,
        0,
    );

    const outOfStock = cart.some((p) => p.product.inventory === 0);

    const handleDecrease = (item: TCartItem<TProductWithImages>): void => {
        if (item.amount === 1) {
            return;
        }
        addProductToCart({
            product: item.product,
            amount: -1,
        });
    };

    const handleIncrease = (item: TCartItem<TProductWithImages>): void => {
        if (item.amount === item.product.inventory) {
            return;
        }
        addProductToCart({
            product: item.product,
            amount: 1,
        });
    };

    const handleSetAmount = (item: TCartItem<TProductWithImages>) => {
        return (e: ChangeEvent<HTMLInputElement>): void => {
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
    };

    const handleCheckout = async (): Promise<void> => {
        if (pathname !== "/checkout") {
            const { data } = await getProductsById(
                cart.map((i) => i.product.id),
            );
            const errorMessage = syncCart(data, cart);
            if (errorMessage) {
                setError(errorMessage);
                return;
            }
            void navigate("/checkout");
        }
        handleClose();
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
                {cart.length > 0 ? (
                    <>
                        {cart.map((item) => {
                            return (
                                <Row
                                    className="border-bottom pb-3 pt-3"
                                    key={item.product.id}
                                >
                                    <div className="d-flex justify-content-between mb-3">
                                        <div>{item.product.name}</div>
                                        <Button
                                            variant="link"
                                            onClick={() =>
                                                removeProductFromCart(
                                                    item.product,
                                                )
                                            }
                                        >
                                            <AiOutlineDelete size={24} />
                                        </Button>
                                    </div>
                                    <Row className="justify-content-between align-items-center text-center gap-3">
                                        <Col sm={"4"}>
                                            <Image
                                                height={100}
                                                src={
                                                    item.product.images[0]
                                                        .img_src
                                                }
                                            />
                                        </Col>
                                        <Col
                                            sm={"2"}
                                            className="d-flex justify-content-center"
                                        >
                                            <Button
                                                variant="link"
                                                className="text-decoration-none p-0"
                                                onClick={() =>
                                                    handleDecrease(item)
                                                }
                                            >
                                                <FiMinus size="2rem" />
                                            </Button>
                                            <FormControl
                                                type="text"
                                                className="p-0 ps-2 pe-2 text-center"
                                                style={{ width: "3rem" }}
                                                onChange={handleSetAmount(item)}
                                                value={item.amount}
                                            />
                                            <Button
                                                variant="link"
                                                className="text-decoration-none p-0"
                                                onClick={() =>
                                                    handleIncrease(item)
                                                }
                                            >
                                                <BsPlus size="2rem" />
                                            </Button>
                                        </Col>
                                        <Col sm={"4"}>
                                            <ItemPrice item={item} />
                                        </Col>
                                    </Row>
                                </Row>
                            );
                        })}
                        {error.length > 0 && (
                            <div className="d-flex justify-content-center mt-3">
                                <Alert
                                    variant="danger"
                                    style={{ whiteSpace: "pre-wrap" }}
                                >
                                    {error}
                                </Alert>
                            </div>
                        )}
                        <Row className="align-items-center mt-3">
                            <Col className="fs-4">
                                Total: {toPriceNumber(totalPrice)} $
                            </Col>
                            <Col className="text-end">
                                <Button
                                    variant="success"
                                    onClick={() => {
                                        void handleCheckout();
                                    }}
                                    disabled={
                                        !cart.length ||
                                        pathname === "/checkout" ||
                                        outOfStock
                                    }
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

export default CartContent;
