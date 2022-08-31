import { gql } from "apollo-server-express";

const productTypes = gql`
	scalar JSON

	type Image {
		id: ID!
		source: String!
		product_id: ID!
	}
	type Product {
		id: ID!
		name: String!
		price: Int!
		description: JSON!
		images: [Image]!
		category_id: ID!
		company: String!
		inventory: Int!
		freeShipping: Boolean!
		discount: Int!
		created_at: DateTime!
		updated_at: DateTime!
	}
	extend type Query {
		products: [Product]
	}

	# Mutations
	input ImageSrc {
		source: String!
	}
	interface ProductMutationType {
		name: String!
		price: Int!
		description: JSON!
		images: [ImageSrc]!
		category_id: ID!
		company: String!
		inventory: Int!
		freeShipping: Boolean!
		discount: Int!
		created_at: DateTime!
		updated_at: DateTime!
	}
	input CreateProductInput implements ProductMutationType {

	}
	input UpdateProductInput implements ProductMutationType {
	}

	extend type Mutation {
		createProduct(input: CreateProductInput!): Product!
		updateProduct(input: UpdateProductInput!): Product!
		deleteProduct(id: ID!): Product
	}
`;

export default productTypes;
