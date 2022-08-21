import { gql } from "apollo-server-express";

const typeDefs = gql`
	type User {
		id: ID!
		name: String!
		username: String!
	}
	type Query {
		users: [User]!
	}
`;
