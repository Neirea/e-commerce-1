import { gql } from "apollo-server-express";

const categoryTypes = gql`
	type Category {
		id: ID!
		name: String!
		parent_id: Int
	}

	extend type Query {
		categories: [Category!]
	}

	input CreateCategoryInput {
		name: String!
		parent_id: Int
	}
	input UpdateCategoryInput {
		id: ID!
		name: String!
		parent_id: Int
	}

	extend type Mutation {
		createCategory(input: CreateCategoryInput!): Category!
		updateCategory(input: UpdateCategoryInput!): Category!
		deleteCategory(id: ID!): Boolean
	}
`;

export default categoryTypes;
