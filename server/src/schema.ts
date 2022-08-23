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
		created_at: Date!
		profile: Profile!
	}
	type Profile {
		id: ID!
		avatar: String!
		user_id: Int!
	}
	type Query {
		users: [User!]!
		user(id: ID!): User!
	}

	input CreateUserInput {
		name: String!
		username: String!
		email: String!
		avatar: String
	}
	input UpdateUserInput {
		id: ID!
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

export const resolvers = {
	Date: dateScalar,
	Query: {
		users: () => {
			return prisma.user.findMany();
		},
		user: (parent: any, args: any) => {
			return prisma.user.findMany({ where: { id: Number(args.id) } });
		},
	},
	Mutation: {
		createUser: (parent: any, args: any) => {
			const user = args.input;
			return prisma.user.create({ data: user }); //figure out Profile creation (1-to-1 rel)
		},
		updateUser: (parent: any, args: any) => {
			const userId = args.input.id;
			return prisma.user.update({
				where: { id: userId },
				data: { ...args.input }, // probably wrong #any
			});
		},
		deleteUser: (parent: any, args: any) => {
			return prisma.user.delete({ where: { id: args.id } });
		},
	},
	// User: {
	// 	profile: (parent:any,args:any)=>{
	// 		return prisma.user.findFirst({where: id:Number(args.id)})
	// 	}
	// }
};
