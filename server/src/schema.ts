import { PrismaClient } from "@prisma/client";
import { gql } from "apollo-server-express";
import { GraphQLScalarType, Kind } from "graphql";

const naiveIsoDateRegex =
	/(\d{4})-(\d{2})-(\d{2})T((\d{2}):(\d{2}):(\d{2}))\.(\d{3})Z/;

const dateScalar = new GraphQLScalarType({
	name: "Date",
	description: "Date custom scalar type",
	serialize(value: any) {
		return value.getTime(); // Convert outgoing Date to integer for JSON
	},
	parseValue(value: any) {
		if (!naiveIsoDateRegex.test(value)) {
			throw new Error("Invalid date format");
		}
		return new Date(value); // Convert incoming integer to Date
	},
	parseLiteral(ast) {
		if (ast.kind === Kind.INT) {
			return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
		}
		return null; // Invalid hard-coded value (not an integer)
	},
});

const prisma = new PrismaClient();

/* Date type */
export const typeDefs = gql`
	scalar Date

	type User {
		id: ID!
		name: String!
		username: String!
		role: Role!
		created_at: Date!
	}
	type Query {
		users: [User!]!
	}

	enum Role {
		USER
		ADMIN
	}
`;

export const resolvers = {
	Date: dateScalar,
	Query: {
		users() {
			return prisma.user.findMany();
		},
	},
};
