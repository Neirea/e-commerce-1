import { useQuery } from "@tanstack/react-query";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import { Link } from "react-router";
import LoadingProgress from "../components/LoadingProgress";
import { getAllOrders } from "../queries/Order";
import { toPriceNumber } from "../utils/numbers";

const Orders = (): JSX.Element => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["order"],
        queryFn: getAllOrders,
    });

    const sortedOrders = data?.data
        ? [...data.data].sort(
              (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at),
          )
        : undefined;

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

    if (isLoading) {
        return <Container as="main" />;
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
                            const totalOrderPricePaid =
                                order.order_items.reduce(
                                    (prev, curr) =>
                                        prev + curr.amount * curr.price,
                                    order.shipping_cost,
                                );
                            const textColor =
                                order.status === "CANCELLED"
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
                                                    },
                                                )}
                                            </tbody>
                                        </Table>
                                    </td>
                                    <td>
                                        {createdAt.toLocaleDateString("en-GB")}
                                    </td>
                                    <td className={`fs-5 ${textColor}`}>
                                        <div>{order.status}</div>
                                    </td>
                                    <td className="fs-5">
                                        {`${toPriceNumber(
                                            totalOrderPricePaid,
                                        )} $`}
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
