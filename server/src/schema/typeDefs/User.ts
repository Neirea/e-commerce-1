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

	# Mutations
	input CreateUserInput {
		name: String!
		username: String!
		email: String!
		avatar: String
		password: String
	}

	type Mutation {
		createUser(input: CreateUserInput!): User!
		deleteUser(id: ID!): User
		logout: Boolean!
	}
`;

export default userTypeDefs;
