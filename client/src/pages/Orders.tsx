import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import LoadingProgress from "../components/LoadingProgress";
import { cancelOrder, getAllOrders } from "../queries/Order";
import { toPriceNumber } from "../utils/numbers";

const Orders = () => {
    const queryClient = useQueryClient();
    const [paymentLoading, setPaymentLoading] = useState(false);
    const { data, isLoading, error } = useQuery({
        queryKey: ["order"],
        queryFn: getAllOrders,
    });

    const cancelMutation = useMutation({
        mutationFn: cancelOrder,
        onSuccess: () => {
            queryClient.invalidateQueries(["order"]);
        },
    });

    const actionLoading =
        paymentLoading || cancelMutation.isLoading || isLoading;

    const sortedOrders = data?.data
        ? [...data.data].sort(
              (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
          )
        : undefined;

    const handlePayment = async (id: number) => {
        setPaymentLoading(true);

        try {
            const { data } = await axios.post<{
                url: string;
            }>(`/payment/checkout/${id}`);

            window.open(data.url, "_self");
        } catch (error) {
            setPaymentLoading(false);
            console.error(
                `A payment error occurred: ${(error as AxiosError).message}`
            );
        }
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
            <LoadingProgress isLoading={isLoading} />
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
                                order.status === "PENDING"
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
                                        {order.status === "PENDING" && (
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
                                                    onClick={
                                                        () =>
                                                            cancelMutation.mutate(
                                                                order.id
                                                            )
                                                        // handleCancel({
                                                        //     variables: {
                                                        //         id: order.id,
                                                        //     },
                                                        //     refetchQueries: [
                                                        //         "GetAllOrders",
                                                        //     ],
                                                        //     awaitRefetchQueries:
                                                        //         true,
                                                        // })
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                    <td className="fs-5">
                                        {order.status === "PENDING"
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
