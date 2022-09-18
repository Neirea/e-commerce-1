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
		images: [Image!]!
		variants: [Product!]!
	}
	extend type Query {
		products: [Product!]!
		product(id: Int!): Product
		filteredProducts(input: QueryProductInput!): [Product!]!
		featuredProducts(limit: Int!, offset: Int!): [Product!]!
		popularProducts(limit: Int!, offset: Int!): [Product!]!
		relatedProducts(input: QueryRelatedInput!): [Product!]!
	}
	input QueryRelatedInput {
		limit: Int!
		offset: Int!
		company_id: Int!
		category_id: Int!
	}
	# Query inputs
	input QueryProductInput {
		category_id: Int
		company_id: Int
		min_price: Int
		max_price: Int
		search_string: String
		limit: Int!
		offset: Int!
	}

	# Mutations inputs
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
		variants: [Int!]
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
		variants: [Int!]
	}

	extend type Mutation {
		createProduct(input: CreateProductInput!): Boolean!
		updateProduct(input: UpdateProductInput!): Boolean!
		deleteProduct(id: Int!): Boolean!
	}
`;

export default productTypes;
