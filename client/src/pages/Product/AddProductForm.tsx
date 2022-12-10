import { ChangeEvent, FormEvent, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import useApolloCartStore from "../../global/useApolloCartStore";
import { GetSingleProductQuery } from "../../generated/graphql";
import { toPriceNumber } from "../../utils/numbers";

interface IAddProductForm {
    data: GetSingleProductQuery;
    handleShowCart: () => void;
}

const AddProductForm = ({ data, handleShowCart }: IAddProductForm) => {
    const [amount, setAmount] = useState(1);
    const { addProductToCart } = useApolloCartStore();

    const handleAmount = (e: ChangeEvent<HTMLInputElement>) => {
        setAmount(+e.target.value);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // add to cart variable
        if (data?.product && data.product.inventory >= amount) {
            addProductToCart({ product: data.product, amount: amount });
        }
        // open cart modal
        handleShowCart();
    };

    if (data.product == null) {
        return null;
    }
    return (
        <Form onSubmit={handleSubmit}>
            <Row className="d-flex justify-content-between align-items-center gap-3 pt-3 mb-4">
                {data.product.inventory > 0 ? (
                    <Col>
                        <Form.Control
                            className="w-25"
                            type="number"
                            value={amount}
                            min={1}
                            max={data.product.inventory}
                            onChange={handleAmount}
                        />
                    </Col>
                ) : (
                    <Col className="text-danger fs-4">Out of stock</Col>
                )}

                <Col className="fs-3">
                    <div className="d-flex gap-3 align-items-center">
                        <div>
                            {data.product.discount > 0 && (
                                <s className="text-muted fs-5">{`${toPriceNumber(
                                    amount * data.product.price
                                )} $`}</s>
                            )}
                        </div>
                        <div
                            className={
                                data.product.discount
                                    ? "text-danger fs-3 lh-1"
                                    : "fs-3 lh-1"
                            }
                        >
                            {`${toPriceNumber(
                                ((100 - data.product.discount) / 100) *
                                    amount *
                                    data.product.price
                            )} $`}
                        </div>
                    </div>
                </Col>
            </Row>
            <Button
                type="submit"
                variant="success"
                disabled={!data.product.inventory}
                style={{ width: "10rem" }}
            >
                Add to Cart
            </Button>
        </Form>
    );
};

export default AddProductForm;
