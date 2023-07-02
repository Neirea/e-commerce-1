import { AiOutlineDelete } from "@react-icons/all-files/ai/AiOutlineDelete";
import { BsPlus } from "@react-icons/all-files/bs/BsPlus";
import { FiMinus } from "@react-icons/all-files/fi/FiMinus";
import { BaseSyntheticEvent, useState } from "react";
import {
    Alert,
    Button,
    Col,
    FormControl,
    Image,
    Modal,
    Row,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import useCartStore from "../../../store/useCartStore";
import { CartItem } from "../../../store/useCartStore";
import { toPriceNumber } from "../../../utils/numbers";
import { IProductWithImages } from "../../../types/Product";
import { getProductsById } from "../../../queries/Product";
import ItemPrice from "../../ItemPrice";

const CartContent = ({
    handleClose,
    show,
}: {
    handleClose: () => void;
    show: boolean;
}) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const { cart, addProductToCart, removeProductFromCart, syncCart } =
        useCartStore();
    const totalPrice = cart.reduce(
        (prev, curr) =>
            prev +
            ((100 - curr.product.discount) / 100) *
                curr.amount *
                curr.product.price,
        0
    );

    const outOfStock = cart.some((p) => p.product.inventory === 0);

    const handleDecrease = (item: CartItem<IProductWithImages>) => {
        addProductToCart({
            product: item.product,
            amount: item.amount === 1 ? 0 : -1,
        });
    };

    const handleIncrease = (item: CartItem<IProductWithImages>) => {
        addProductToCart({
            product: item.product,
            amount: item.amount === item.product.inventory ? 0 : 1,
        });
    };

    const handleSetAmount = (item: CartItem<IProductWithImages>) => {
        return (e: BaseSyntheticEvent) => {
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

    const handleCheckout = async () => {
        if (pathname !== "/checkout") {
            const { data } = await getProductsById(
                cart.map((i) => i.product.id)
            );
            const errorMessage = syncCart(data, cart);
            if (errorMessage) {
                setError(errorMessage);
                return;
            }
            navigate("/checkout");
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
                                                    item.product
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
                                    onClick={handleCheckout}
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
