import { gql } from "apollo-server-express";

const productTypes = gql`
	scalar JSON

	type Image {
		img_id: String!
		img_src: String!
	}

	type ProductOrdersCount {
		orders: Int!
	}

	type QuerySearchDataResult {
		min: Int!
		max: Int!
		categories: [Category!]!
		companies: [Company!]!
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
		created_at: DateTime!
		updated_at: DateTime!
		_count: ProductOrdersCount!
		images: [Image!]!
		variants: [Product!]!
	}
	extend type Query {
		products: [Product!]!
		product(id: Int!): Product
		productsById(ids: [Int!]!): [Product!]!
		filteredProducts(
			limit: Int!
			offset: Int!
			input: QueryProductInput!
		): [Product!]!
		searchData(input: QuerySearchDataInput!): QuerySearchDataResult!
		featuredProducts(limit: Int!, offset: Int!): [Product!]!
		popularProducts(limit: Int!, offset: Int!): [Product!]!
		relatedProducts(
			limit: Int!
			offset: Int!
			input: QueryRelatedInput!
		): [Product!]!
	}

	# Query inputs
	input QueryProductInput {
		category_id: Int
		company_id: Int
		min_price: Int
		max_price: Int
		sortMode: Int
		search_string: String
	}
	input QueryRelatedInput {
		id: Int!
		company_id: Int!
		category_id: Int!
	}
	input QuerySearchDataInput {
		category_id: Int
		company_id: Int
		min_price: Int
		max_price: Int
		search_string: String
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
