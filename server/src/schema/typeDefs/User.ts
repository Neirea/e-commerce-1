import { gql } from "apollo-server-express";

const userTypeDefs = gql`
	scalar DateTime
	enum Role {
		USER
		ADMIN
	}
	enum Platform {
		GOOGLE
		FACEBOOK
	}

	type User {
		id: ID!
		given_name: String!
		family_name: String!
		email: String
		address: String
		platform_id: String!
		platform: Platform!
		role: Role!
		created_at: DateTime!
		avatar: String!
	}

	type Query {
		users: UsersResult
		user(id: ID!): User
		showMe: User
	}

	# Users Query Types
	type UsersQueryResult {
		users: [User!]
	}
	type UsersErrorResult {
		message: String!
	}
	union UsersResult = UsersQueryResult | UsersErrorResult

	input UpdateUserInput {
		id: ID!
		given_name: String
		family_name: String
		address: String
		email: String
		avatar: String
		role: Role!
	}

	type Mutation {
		updateUser(input: UpdateUserInput!): User!
		deleteUser(id: ID!): User
		logout: Boolean!
	}
`;

export default userTypeDefs;
