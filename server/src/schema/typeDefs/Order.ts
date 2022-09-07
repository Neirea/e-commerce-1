import { gql } from "apollo-server-express";

const OrderTypes = gql`
	# create scalar or enum for status
	type Order {
		id: Int!
		total: Int
		shipping_fee: Int
		status: String
		user_id: Int!
	}

	extend type Query {
		orders: [Order!]
	}

	interface OrderInputType {
		title: String
		rating: Int!
		comment: String
	}

	input CreateOrderInput {
		total: Int
		shipping_fee: Int
		user_id: Int!
	}
	input UpdateOrderInput {
		status: String
	}

	extend type Mutation {
		createOrder(input: CreateOrderInput!): Order!
		updateOrder(input: UpdateOrderInput!): Order!
		deleteOrder(id: Int!): Order
	}
`;

export default OrderTypes;
