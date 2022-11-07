import { ChangeEvent, useState } from "react";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { useAppContext } from "../context/AppContext";
import { useCartContext } from "../context/CartContext";
import { toPriceNumber } from "../utils/numbers";
import { serverUrl } from "../utils/server";

const Checkout = () => {
    const { user } = useAppContext();
    const [loading, setLoading] = useState(false);
    const { cart, clearCart } = useCartContext();

    const [name, setName] = useState(
        (user?.given_name || "").concat(
            user?.family_name ? ` ${user?.family_name}` : ""
        )
    );
    const [address, setAddress] = useState(user?.address || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");

    const totalPrice = cart.reduce(
        (prev, curr) =>
            prev +
            ((100 - curr.product.discount) / 100) *
                curr.amount *
                curr.product.price,
        0
    );

    const handleName = (e: ChangeEvent<HTMLInputElement>) =>
        setName(e.target.value);
    const handleAddress = (e: ChangeEvent<HTMLInputElement>) =>
        setAddress(e.target.value);
    const handleEmail = (e: ChangeEvent<HTMLInputElement>) =>
        setEmail(e.target.value);
    const handlePhone = (e: ChangeEvent<HTMLInputElement>) =>
        setPhone(e.target.value);

    const handleCheckout = () => {
        setLoading(true);
        const checkoutItems = cart.map((item) => {
            return { id: item.product.id, amount: item.amount };
        });

        fetch(`${serverUrl}/api/checkout`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                items: checkoutItems,
                buyer: {
                    name,
                    email,
                    address,
                    phone,
                },
            }),
        })
            .then((res) => {
                //clear cart on successful request
                setLoading(false);
                clearCart();
                if (res.ok) {
                    return res.json();
                }
                //reject promise on failed stripe action
                return res.json().then((json) => Promise.reject(json));
            })
            .then(({ url }) => {
                //open stripe window
                window.open(url, "_self");
            })
            .catch((e) => {
                switch (e.type) {
                    case "StripeCardError":
                        console.log(`A payment error occurred: ${e.message}`);
                        break;
                    case "StripeInvalidRequestError":
                        console.log("An invalid request occurred.");
                        break;
                    default:
                        console.log(
                            "Another problem occurred, maybe unrelated to Stripe."
                        );
                        break;
                }
            });
    };

    return (
        <Container as="main" className="mt-3">
            <Form onSubmit={handleCheckout}>
                <Row className="justify-content-around">
                    <Col sm="4">
                        <Form.Group className="mb-3">
                            <Form.Label>Your name</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={handleName}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Shipping address</Form.Label>
                            <Form.Control
                                type="text"
                                value={address}
                                onChange={handleAddress}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Contact email</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={handleEmail}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Contact phone number (optional)
                            </Form.Label>
                            <Form.Control
                                type="tel"
                                value={phone}
                                onChange={handlePhone}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm="4">
                        {!!cart.length &&
                            cart.map((item) => {
                                return (
                                    <Row
                                        className="border-bottom pb-3 pt-3 align-items-center"
                                        key={uuidv4()}
                                    >
                                        <Col className="d-flex justify-content-between">
                                            <div>{item.product.name}</div>
                                        </Col>
                                        <Col className="d-flex align-items-center gap-2">
                                            <div>{`x${item.amount}`}</div>
                                            <Image
                                                height={50}
                                                src={
                                                    item.product.images[0]
                                                        .img_src
                                                }
                                            />
                                        </Col>
                                        <Col>
                                            <div>
                                                {!!item.product.discount && (
                                                    <s className="text-muted fs-5">{`${toPriceNumber(
                                                        item.amount *
                                                            item.product.price
                                                    )} $`}</s>
                                                )}
                                            </div>
                                            <div
                                                className={
                                                    item.product.discount
                                                        ? "text-danger fs-4 lh-1"
                                                        : "fs-4 lh-1"
                                                }
                                            >
                                                {`${toPriceNumber(
                                                    ((100 -
                                                        item.product.discount) /
                                                        100) *
                                                        item.amount *
                                                        item.product.price
                                                )} $`}
                                            </div>
                                        </Col>
                                    </Row>
                                );
                            })}
                        <Row className="align-items-center mt-3">
                            <Col className="text-end fs-4 pe-5">
                                Total: {toPriceNumber(totalPrice)} $
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div className="d-flex justify-content-center mt-3">
                    <Button
                        variant="success"
                        onClick={handleCheckout}
                        disabled={loading}
                    >
                        Proceed
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default Checkout;
