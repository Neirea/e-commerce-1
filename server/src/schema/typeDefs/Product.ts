import { gql } from "apollo-server-express";

const productTypes = gql`
	scalar JSON

	type Product {
		id: ID!
		name: String!
		price: Float!
		description: JSON!
		company: String!
		inventory: Int!
		shipping_cost: Float!
		discount: Int!
		avg_rating: Float!
		num_of_reviews: Int!
		images: [String]!
		category_id: ID!
		created_at: DateTime!
		updated_at: DateTime!
	}
	extend type Query {
		products: [Product]
	}

	# Mutations
	input CreateProductInput {
		name: String!
		price: Float!
		description: JSON!
		company: String!
		inventory: Int!
		shipping_cost: Float!
		discount: Int!
		images: [String]!
		category_id: ID!
	}
	input UpdateProductInput {
		name: String!
		price: Float!
		description: JSON!
		company: String!
		inventory: Int!
		shipping_cost: Float!
		discount: Int!
		images: [String]!
		category_id: ID!
	}

	extend type Mutation {
		createProduct(input: CreateProductInput!): Product!
		updateProduct(input: UpdateProductInput!): Product!
		deleteProduct(id: ID!): Product
	}
`;

export default productTypes;
