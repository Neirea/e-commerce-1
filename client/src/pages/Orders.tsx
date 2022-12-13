import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import {
    CancelOrderMutation,
    CancelOrderMutationVariables,
    GetAllOrdersQuery,
    Status,
} from "../generated/graphql";
import { MUTATION_CANCEL_ORDER, QUERY_ALL_ORDERS } from "../queries/Order";
import { toPriceNumber } from "../utils/numbers";
import { serverUrl } from "../utils/server";

const Orders = () => {
    const [paymentLoading, setPaymentLoading] = useState(false);
    const { data, loading, error } =
        useQuery<GetAllOrdersQuery>(QUERY_ALL_ORDERS);
    const [handleCancel, { loading: cancelLoading }] = useMutation<
        CancelOrderMutation,
        CancelOrderMutationVariables
    >(MUTATION_CANCEL_ORDER);

    const actionLoading = paymentLoading || cancelLoading || loading;

    const sortedOrders = data?.orders
        ? [...data.orders].sort((a, b) => b.created_at - a.created_at)
        : undefined;

    const handlePayment = (id: number) => {
        setPaymentLoading(true);
        fetch(`${serverUrl}/api/payment/checkout/${id}`, {
            method: "PATCH",
            credentials: "include",
        })
            .then((res) => {
                setPaymentLoading(false);
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

    if (error) {
        return (
            <Container
                as="main"
                className="d-flex justify-content-center flex-row"
            >
                <div className="mt-5 text-center">
                    <h1 className="text-danger">Error</h1>
                    <h3 className="mt-3">{"Failed to fetch your orders"}</h3>
                </div>
            </Container>
        );
    }
    if (sortedOrders?.length === 0) {
        return (
            <Container
                as="main"
                className="d-flex justify-content-center flex-row"
            >
                <div className="mt-5 text-center">
                    <h2 className="mt-3">There are no orders from you yet</h2>
                </div>
            </Container>
        );
    }

    return (
        <Container as="main" className="pt-3">
            <h2 className="text-center">Your Orders:</h2>
            {loading && (
                <div>
                    <Loading />
                </div>
            )}
            {!!sortedOrders?.length && (
                <Table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>Products</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedOrders.map((order) => {
                            const totalOrderPricePending =
                                order.order_items.reduce(
                                    (prev, curr) =>
                                        prev +
                                        curr.amount *
                                            ((100 - curr.product.discount) /
                                                100) *
                                            curr.product.price,
                                    0
                                );
                            const totalOrderPricePaid =
                                order.order_items.reduce(
                                    (prev, curr) =>
                                        prev + curr.amount * curr.price,
                                    0
                                );
                            const textColor =
                                order.status === Status.PENDING
                                    ? "text-danger"
                                    : "text-success";
                            const createdAt = new Date(order.created_at);
                            return (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>
                                        <Table borderless>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.order_items.map(
                                                    (item) => {
                                                        return (
                                                            <tr
                                                                key={
                                                                    item.product
                                                                        .id
                                                                }
                                                            >
                                                                <td
                                                                    style={{
                                                                        width: "80%",
                                                                    }}
                                                                >
                                                                    <Link
                                                                        className="custom-link"
                                                                        to={`/product/${item.product.id}`}
                                                                    >
                                                                        {
                                                                            item
                                                                                .product
                                                                                .name
                                                                        }
                                                                    </Link>
                                                                </td>
                                                                <td
                                                                    style={{
                                                                        width: "20%",
                                                                    }}
                                                                >
                                                                    x
                                                                    {
                                                                        item.amount
                                                                    }
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                            </tbody>
                                        </Table>
                                    </td>
                                    <td>
                                        {createdAt.toLocaleDateString("en-GB")}
                                    </td>
                                    <td className={`fs-5 ${textColor}`}>
                                        <div>{order.status}</div>
                                        {order.status === Status.PENDING && (
                                            <>
                                                <Button
                                                    variant="success"
                                                    title="Pay for the order"
                                                    disabled={actionLoading}
                                                    className="d-block m-auto mb-1"
                                                    onClick={() =>
                                                        handlePayment(order.id)
                                                    }
                                                >
                                                    Continue
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    title="Cancel Order"
                                                    disabled={actionLoading}
                                                    onClick={() =>
                                                        handleCancel({
                                                            variables: {
                                                                id: order.id,
                                                            },
                                                            refetchQueries: [
                                                                "GetAllOrders",
                                                            ],
                                                            awaitRefetchQueries:
                                                                true,
                                                        })
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                    <td className="fs-5">
                                        {order.status === Status.PENDING
                                            ? toPriceNumber(
                                                  totalOrderPricePending
                                              )
                                            : toPriceNumber(
                                                  totalOrderPricePaid
                                              )}{" "}
                                        $
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default Orders;
