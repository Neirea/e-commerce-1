import { gql } from "apollo-server-express";

const userTypeDefs = gql`
	scalar DateTime
	enum Role {
		USER
		ADMIN
	}

	type User {
		id: ID!
		name: String!
		username: String!
		email: String
		role: Role!
		created_at: DateTime!
		avatar: String!
	}

	type Query {
		users: UsersResult
		user(id: ID!): User!
	}

	# Users Query Types
	type UsersQueryResult {
		users: [User!]
	}
	type UsersErrorResult {
		message: String!
	}
	union UsersResult = UsersQueryResult | UsersErrorResult

	# Mutations
	input CreateUserInput {
		name: String!
		username: String!
		email: String!
		avatar: String
		password: String
	}
	input UpdateUserInput {
		name: String
		newUsername: String
		newPassword: String
		avatar: String
	}

	type Mutation {
		createUser(input: CreateUserInput!): User!
		updateUser(input: UpdateUserInput!): User!
		deleteUser(id: ID!): User
	}
`;

export default userTypeDefs;
