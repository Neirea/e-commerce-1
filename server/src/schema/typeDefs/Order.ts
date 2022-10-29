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
		price: Int!
		product_id: Int!
	}
	type Order {
		id: Int!
		status: Status!
		user_id: Int
		buyer_name: String!
		buyer_email: String!
		buyer_phone: String
		delivery_address: String!
		order_items: [SingleOrderItem!]!
	}

	extend type Query {
		orders: [Order!]!
	}

	input CreateOrderInput {
		user_id: Int
		buyer_name: String!
		buyer_email: String!
		buyer_phone: String
		delivery_address: String!
	}

	extend type Mutation {
		createOrder(input: CreateOrderInput!): Boolean!
		updateOrder(id: Int!, status: Status!): Boolean!
		cancelOrder(id: Int!): Boolean!
		deleteOrder(id: Int!): Boolean!
	}
`;

export default orderTypes;
