import { useQuery } from "@apollo/client";
import { Container, Table, Alert, Button } from "react-bootstrap";
import { GetAllOrdersQuery, Status } from "../generated/graphql";
import { QUERY_ALL_ORDERS } from "../queries/Order";
import { v4 as uuidv4 } from "uuid";
import { toPriceNumber } from "../utils/numbers";
import Loading from "../components/Loading";
import { serverUrl } from "../utils/server";

const Orders = () => {
	const { data, loading, error } =
		useQuery<GetAllOrdersQuery>(QUERY_ALL_ORDERS);

	const sortedOrders = data?.orders
		? [...data.orders].sort((a, b) => b.id - a.id)
		: undefined;

	const handlePayment = (id: number) => {
		fetch(`${serverUrl}/api/checkout/${id}`, {
			method: "PATCH",
			credentials: "include",
		})
			.then((res) => {
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
						console.log("Another problem occurred, maybe unrelated to Stripe.");
						break;
				}
			});
	};

	if (error) {
		return (
			<Container as="main" className="d-flex justify-content-center flex-row">
				<div className="mt-5 text-center">
					<h1 className="text-danger">Error</h1>
					<h3 className="mt-3">{"Failed to fetch your orders"}</h3>
				</div>
			</Container>
		);
	}
	if (sortedOrders?.length === 0) {
		return (
			<Container as="main" className="d-flex justify-content-center flex-row">
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
							<th>Status</th>
							<th>Total Price</th>
						</tr>
					</thead>
					<tbody>
						{sortedOrders.map((order) => {
							const totalOrderPrice = order.order_items.reduce(
								(prev, curr) => prev + curr.price,
								0
							);
							const textColor =
								order.status === Status.PENDING
									? "text-danger"
									: "text-success";
							return (
								<tr key={uuidv4()}>
									<td>{order.id}</td>
									<td>
										<Table borderless>
											<thead>
												<tr>
													<th>Name</th>
													<th>Amount</th>
													<th>Price</th>
												</tr>
											</thead>
											<tbody>
												{order.order_items.map((item) => {
													return (
														<tr key={uuidv4()}>
															<td style={{ width: "60%" }}>
																{item.product?.name}
															</td>
															<td style={{ width: "20%" }}>x{item.amount}</td>
															<td style={{ width: "20%" }}>
																{toPriceNumber(item.price)} $
															</td>
														</tr>
													);
												})}
											</tbody>
										</Table>
									</td>
									<td className={`fs-5 ${textColor}`}>
										<div>{order.status}</div>
										{order.status === Status.PENDING && (
											<Button
												variant="success"
												title="Pay for the order"
												onClick={() => handlePayment(order.id)}
											>
												Continue
											</Button>
										)}
									</td>
									<td className="fs-5">{toPriceNumber(totalOrderPrice)} $</td>
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
