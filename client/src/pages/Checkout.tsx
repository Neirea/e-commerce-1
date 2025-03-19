import {
    AddressElement,
    Elements,
    LinkAuthenticationElement,
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState, type FormEvent } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router";
import ItemPrice from "../components/ItemPrice";
import LoadingSpinner from "../components/LoadingSpinner";
import useCurrentUser from "../hooks/useCurrentUser";
import { checkout } from "../queries/Checkout";
import { getProductsById } from "../queries/Product";
import useCartStore from "../store/useCartStore";
import { getDiscountPrice } from "../utils/getDiscountedPrice";
import { toPriceNumber } from "../utils/numbers";
import { clientUrl, stripePublicKey } from "../utils/server";

const stripePromise = loadStripe(stripePublicKey);

const Checkout = (): JSX.Element => {
    const navigate = useNavigate();
    const [clientSecret, setClientSecret] = useState("");
    const { cart } = useCartStore();

    const checkoutItems = cart.map((item) => {
        return { id: item.product.id, amount: item.amount };
    });

    useEffect(() => {
        if (cart.length === 0) {
            void navigate("/");
            return;
        }
        void checkout({ items: checkoutItems }).then((response) => {
            setClientSecret(response.data.clientSecret);
        });
    }, [cart]);

    if (!clientSecret) {
        return (
            <Container
                as="main"
                className="d-flex justify-content-center align-items-center"
            >
                <LoadingSpinner size={50} />
            </Container>
        );
    }

    return (
        <Container as="main" className="mt-3">
            <Elements options={{ clientSecret }} stripe={stripePromise}>
                <CheckoutForm />
            </Elements>
        </Container>
    );
};

const CheckoutForm = (): JSX.Element => {
    const stripe = useStripe();
    const elements = useElements();

    const { user } = useCurrentUser();
    const [loading, setLoading] = useState(false);
    const { cart, syncCart } = useCartStore();
    const [error, setError] = useState("");

    const shippingCost = cart.reduce(
        (shippingCost, item) =>
            Math.max(shippingCost, item.product.shipping_cost),
        0,
    );

    const totalPrice = cart.reduce(
        (prev, curr) =>
            prev +
            getDiscountPrice(curr.product.price, curr.product.discount) *
                curr.amount,
        shippingCost,
    );

    const outOfStock = cart.some((p) => p.product.inventory === 0);

    const isButtonDisabled =
        loading || outOfStock || stripe == null || elements == null;

    const handleCheckout = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        if (stripe == null || elements == null) {
            return;
        }
        setLoading(true);

        const { data } = await getProductsById(cart.map((i) => i.product.id));
        const syncCartError = syncCart(data, cart);
        if (syncCartError) {
            setError(syncCartError);
            return;
        }

        await stripe
            .confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${clientUrl}/order_payment`,
                },
            })
            .then(({ error }) => {
                if (
                    (error.type === "card_error" ||
                        error.type === "validation_error") &&
                    error.message
                ) {
                    setError(error.message);
                } else {
                    setError("An unknown error occurred");
                }
            })
            .finally(() => setLoading(false));
    };

    return (
        <div>
            <Form onSubmit={(e) => void handleCheckout(e)}>
                <h2 className="text-center">Checkout</h2>
                <Row className="flex-col justify-content-center flex-sm-row">
                    <Col md="8">
                        {cart.length > 0 &&
                            cart.map((item) => {
                                return (
                                    <Row
                                        className="border-bottom pb-3 pt-3 align-items-center gap-2"
                                        key={item.product.id}
                                    >
                                        <Col className="d-flex justify-content-between">
                                            <div>{item.product.name}</div>
                                        </Col>
                                        <Col
                                            md="2"
                                            className="d-flex align-items-center gap-2"
                                        >
                                            <div>{`x${item.amount}`}</div>
                                            <Image
                                                height={50}
                                                src={
                                                    item.product.images[0]
                                                        .img_src
                                                }
                                            />
                                        </Col>
                                        <Col md="3">
                                            <ItemPrice item={item} />
                                        </Col>
                                    </Row>
                                );
                            })}
                        <Row className="border-bottom pb-3 pt-3 align-items-center gap-2">
                            <Col className="d-flex justify-content-between">
                                <div>Shipping Cost</div>
                            </Col>
                            <Col md="3" className="fs-4 lh-1">
                                {toPriceNumber(shippingCost)} $
                            </Col>
                        </Row>
                        <Row className="flex-col align-items-center mt-3 mb-3">
                            <Col className="text-end fs-4 pe-5">
                                Total: {toPriceNumber(totalPrice)} $
                            </Col>
                        </Row>
                        <Row>
                            <LinkAuthenticationElement
                                options={{
                                    defaultValues: {
                                        email: user?.email || "",
                                    },
                                }}
                            />
                            <AddressElement
                                className="mt-3 mb-3"
                                options={{
                                    mode: "shipping",
                                    display: { name: "split" },
                                    fields: { phone: "always" },
                                    defaultValues: {
                                        firstName: user?.given_name,
                                        lastName: user?.family_name,
                                        phone: user?.phone,
                                        address: {
                                            country:
                                                user?.address.country || "",
                                            city: user?.address.city,
                                            line1: user?.address.line1,
                                            line2: user?.address.line2,
                                            state: user?.address.state,
                                            postal_code:
                                                user?.address.postal_code,
                                        },
                                    },
                                }}
                            />

                            <PaymentElement />
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
                        disabled={isButtonDisabled}
                    >
                        Proceed
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default Checkout;
