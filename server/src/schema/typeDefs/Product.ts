import { gql } from "apollo-server-express";

const productTypes = gql`
	scalar JSON

	type Image {
		img_id: String!
		img_src: String!
	}

	type Product {
		id: Int!
		name: String!
		price: Float!
		description: JSON!
		company: Company!
		category: Category!
		inventory: Int!
		shipping_cost: Float!
		discount: Int!
		avg_rating: Float!
		num_of_reviews: Int!
		created_at: DateTime!
		updated_at: DateTime!
		images: [Image!]
	}
	extend type Query {
		products: [Product!]!
	}

	# Mutations
	input CreateProductInput {
		name: String!
		price: Float!
		description: JSON!
		inventory: Int!
		shipping_cost: Float!
		discount: Int!
		img_id: [String!]!
		img_src: [String!]!
		company_id: Int!
		category_id: Int!
	}
	input UpdateProductInput {
		id: Int!
		name: String!
		price: Float!
		description: JSON!
		inventory: Int!
		shipping_cost: Float!
		discount: Int!
		img_id: [String!]!
		img_src: [String!]!
		company_id: Int!
		category_id: Int!
	}

	extend type Mutation {
		createProduct(input: CreateProductInput!): Boolean!
		updateProduct(input: UpdateProductInput!): Boolean!
		deleteProduct(id: Int!): Boolean!
	}
`;

export default productTypes;
