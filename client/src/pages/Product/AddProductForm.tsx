import { ChangeEvent, FormEvent, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import useCartStore from "../../store/useCartStore";
// import { GetSingleProductQuery } from "../../generated/graphql";
import { toPriceNumber } from "../../utils/numbers";
import { ProductWithImgVariants } from "../../types/Product";

interface IAddProductForm {
    product: ProductWithImgVariants;
    handleShowCart: () => void;
}

const AddProductForm = ({ product, handleShowCart }: IAddProductForm) => {
    const [amount, setAmount] = useState(1);
    const { addProductToCart } = useCartStore();

    const handleAmount = (e: ChangeEvent<HTMLInputElement>) => {
        setAmount(+e.target.value);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // add to cart variable
        if (product && product.inventory >= amount) {
            addProductToCart({ product: product, amount: amount });
        }
        // open cart modal
        handleShowCart();
    };

    if (product == null) {
        return null;
    }
    return (
        <Form onSubmit={handleSubmit}>
            <Row className="d-flex justify-content-between align-items-center gap-3 pt-3 mb-4">
                {product.inventory > 0 ? (
                    <Col>
                        <Form.Control
                            className="w-25"
                            type="number"
                            value={amount}
                            min={1}
                            max={product.inventory}
                            onChange={handleAmount}
                        />
                    </Col>
                ) : (
                    <Col className="text-danger fs-4">Out of stock</Col>
                )}

                <Col className="fs-3">
                    <div className="d-flex gap-3 align-items-center">
                        <div>
                            {product.discount > 0 && (
                                <s className="text-muted fs-5">{`${toPriceNumber(
                                    amount * product.price
                                )} $`}</s>
                            )}
                        </div>
                        <div
                            className={
                                product.discount
                                    ? "text-danger fs-3 lh-1"
                                    : "fs-3 lh-1"
                            }
                        >
                            {`${toPriceNumber(
                                ((100 - product.discount) / 100) *
                                    amount *
                                    product.price
                            )} $`}
                        </div>
                    </div>
                </Col>
            </Row>
            <Button
                type="submit"
                variant="success"
                disabled={!product.inventory}
                style={{ width: "10rem" }}
            >
                Add to Cart
            </Button>
        </Form>
    );
};

export default AddProductForm;
