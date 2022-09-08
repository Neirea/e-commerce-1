import { gql } from "apollo-server-express";

const productTypes = gql`
	scalar JSON

	type Product {
		id: Int!
		name: String!
		price: Float!
		description: JSON!
		company_id: Int!
		category_id: Int!
		inventory: Int!
		shipping_cost: Float!
		discount: Int!
		avg_rating: Float!
		num_of_reviews: Int!
		images: [String]!
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
		company_id: Int!
		category_id: Int!
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
		company_id: Int!
		category_id: Int!
	}

	extend type Mutation {
		createProduct(input: CreateProductInput!): Product!
		updateProduct(input: UpdateProductInput!): Product!
		deleteProduct(id: Int!): Product
	}
`;

export default productTypes;
