import { type ChangeEvent, type FormEvent, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import useCartStore from "../store/useCartStore";
import useCurrentUser from "../hooks/useCurrentUser";
import { toPriceNumber } from "../utils/numbers";
import {
    addressDesc,
    addressZod,
    emailZod,
    familyNameZod,
    givenNameZod,
    phoneDesc,
    phoneZod,
} from "../utils/zod";
import { checkout } from "../queries/Checkout";
import { getProductsById } from "../queries/Product";
import { getError } from "../utils/getError";
import ItemPrice from "../components/ItemPrice";

const CheckoutInputSchema = z.object({
    given_name: givenNameZod,
    family_name: familyNameZod,
    email: emailZod,
    address: addressZod,
    phone: phoneZod,
});

type TCheckoutInput = z.infer<typeof CheckoutInputSchema>;

const Checkout = () => {
    const { user } = useCurrentUser();
    const [loading, setLoading] = useState(false);
    const { cart, clearCart, syncCart } = useCartStore();
    const [error, setError] = useState("");

    const [values, setValues] = useState<TCheckoutInput>({
        given_name: user?.given_name || "",
        family_name: user?.family_name || "",
        email: user?.email || "",
        address: user?.address || "",
        phone: user?.phone || "",
    });

    const totalPrice = cart.reduce(
        (prev, curr) =>
            prev +
            ((100 - curr.product.discount) / 100) *
                curr.amount *
                curr.product.price,
        0
    );

    const outOfStock = cart.some((p) => p.product.inventory === 0);

    const handleData = (e: ChangeEvent<HTMLInputElement>) =>
        setValues({ ...values, [e.target.name]: e.target.value });

    const handleCheckout = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const parseInput = CheckoutInputSchema.safeParse(values);
        if (!parseInput.success) {
            setError(fromZodError(parseInput.error).message);
            setLoading(false);
            return;
        }
        const { data } = await getProductsById(cart.map((i) => i.product.id));
        const syncCartError = syncCart(data, cart);
        if (syncCartError) {
            setError(syncCartError);
            return;
        }

        const checkoutItems = cart.map((item) => {
            return { id: item.product.id, amount: item.amount };
        });

        const { given_name, family_name, email, address, phone } = values;

        try {
            const { data } = await checkout({
                items: checkoutItems,
                buyer: {
                    name: given_name + " " + family_name,
                    email,
                    address,
                    phone,
                },
            });
            setError("");
            clearCart();
            //open stripe window
            window.open(data.url, "_self");
        } catch (error) {
            setLoading(false);
            setError(`A payment error occurred: ${getError(error).message}`);
        }
    };

    return (
        <Container as="main" className="mt-3">
            <Form onSubmit={handleCheckout}>
                <Row className="flex-column justify-content-around flex-sm-row">
                    <Col md="4">
                        <Form.Group className="mb-3">
                            <Form.Label>Your given name</Form.Label>
                            <Form.Control
                                type="text"
                                value={values.given_name}
                                name="given_name"
                                onChange={handleData}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Your familiy name</Form.Label>
                            <Form.Control
                                type="text"
                                value={values.family_name}
                                name="family_name"
                                onChange={handleData}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Shipping address</Form.Label>
                            <Form.Label
                                style={{
                                    fontSize: "0.75rem",
                                    fontWeight: "700",
                                }}
                            >
                                ({addressDesc})
                            </Form.Label>
                            <Form.Control
                                type="text"
                                value={values.address}
                                name="address"
                                onChange={handleData}
                                title={addressDesc}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Contact email</Form.Label>
                            <Form.Control
                                type="email"
                                value={values.email}
                                name="email"
                                onChange={handleData}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Contact phone number (optional)
                            </Form.Label>
                            <Form.Control
                                type="tel"
                                value={values.phone}
                                name="phone"
                                title={phoneDesc}
                                onChange={handleData}
                            />
                        </Form.Group>
                    </Col>
                    <Col md="4">
                        {cart.length > 0 &&
                            cart.map((item) => {
                                return (
                                    <Row
                                        className="border-bottom pb-3 pt-3 align-items-center"
                                        key={item.product.id}
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
                                            <ItemPrice item={item} />
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
                <div className="d-flex justify-content-center mt-3">
                    <Button
                        variant="success"
                        type="submit"
                        disabled={loading || outOfStock}
                    >
                        Proceed
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default Checkout;
