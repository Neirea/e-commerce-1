import { Prisma, PrismaClient } from "@prisma/client";
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

	# Mutations
	input CreateUserInput {
		name: String!
		username: String!
		email: String!
		avatar: String
		password: String
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
	# Users Query Types
	type UsersQueryResult {
		users: [User!]
	}
	type UsersErrorResult {
		message: String!
	}
	union UsersResult = UsersQueryResult | UsersErrorResult
`;

export const resolvers = {
	DateTime: dateScalar,
	Query: {
		users: (parent: any, args: any, context: any) => {
			const users = prisma.user.findMany();
			if (users) return { users: users };
			return { message: "There was an Error" };
		},
		user: (parent: any, args: any) => {
			return prisma.user.findMany({ where: { id: Number(args.id) } });
		},
	},
	Mutation: {
		createUser: (parent: any, args: any) => {
			const user = args.input;

			return prisma.user.create({ data: user });
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
	UsersResult: {
		__resolveType(obj: any) {
			if (obj.users) {
				return "UsersQueryResult";
			}
			if (obj.message) {
				return "UsersErrorResult";
			}
			return null; //some gql error
		},
	},
	/* query ExampleQuery {
		users{
			...on UsersQueryResult {
				users{
					id
					username
				}
			}
			...on UsersErrorResult {
				message
			}
		}
	}*/
	// User: {
	// 	profile: (parent:any,args:any)=>{
	// 		return prisma.user.findFirst({where: id:Number(args.id)})
	// 	}
	// }
};
