import { gql } from "apollo-server-express";

const orderTypes = gql`
	# create scalar or enum for status

	enum Status {
		PENDING
		ACCEPTED
		PROCESSING
		DELIVERED
		CANCELLED
	}

	type SingleOrderItem {
		id: Int!
		order_id: Int!
		amount: Int!
		product_id: Int!
	}
	type Order {
		id: Int!
		total: Int!
		shipping_fee: Int!
		status: Status!
		user_id: Int!
		order_items: [SingleOrderItem!]!
	}

	extend type Query {
		orders: [Order!]!
	}

	input CreateOrderInput {
		total: Int!
		shipping_fee: Int!
		user_id: Int!
	}

	extend type Mutation {
		createOrder(input: CreateOrderInput!): Boolean!
		updateOrder(id: Int!, status: Status!): Boolean!
		cancelOrder(id: Int!): Boolean!
		deleteOrder(id: Int!): Boolean!
	}
`;

export default orderTypes;
