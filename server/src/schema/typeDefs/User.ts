import { gql } from "apollo-server-express";

const userTypeDefs = gql`
	scalar DateTime
	enum Role {
		USER
		ADMIN
		EDITOR
	}
	enum Platform {
		GOOGLE
		FACEBOOK
	}

	type User {
		id: Int!
		given_name: String!
		family_name: String!
		email: String
		address: String
		platform_id: String!
		platform: Platform!
		role: [Role!]!
		created_at: DateTime!
		avatar: String!
	}

	type Query {
		users: [User!]
		user(id: Int!): User
		showMe: User
	}

	# Users Query Types
	input UpdateUserInput {
		id: Int!
		given_name: String!
		family_name: String!
		address: String!
		email: String!
		avatar: String!
		role: [Role!]!
	}

	type Mutation {
		updateUser(input: UpdateUserInput!): Boolean!
		deleteUser(id: Int!): Boolean!
		logout: Boolean!
	}
`;

export default userTypeDefs;
