import { GraphQLScalarType, Kind } from "graphql";
import { PrismaClient, Role } from "@prisma/client";
import { Request, Response } from "express";
import {
	MutationDeleteUserArgs,
	UpdateUserInput,
} from "../../generated/graphql";
import { AuthenticationError } from "apollo-server-express";

const prisma = new PrismaClient({ log: ["query"] });

//custom DateTime scalar
const naiveIsoDateRegex =
	/(\d{4})-(\d{2})-(\d{2})T((\d{2}):(\d{2}):(\d{2}))\.(\d{3})Z/;
export const dateScalar = new GraphQLScalarType({
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

const userResolvers = {
	DateTime: dateScalar,
	Query: {
		users: (parent: any, args: undefined, { req }: { req: Request }) => {
			if (!req.session.user?.role.includes(Role.ADMIN)) {
				throw new AuthenticationError(
					"You don't have permissions for this action"
				);
			}
			return prisma.user.findMany();
			// return prisma.$queryRaw`SELECT * FROM public."User";`;
		},
		user: (parent: any, { id }: { id: number }, { req }: { req: Request }) => {
			if (!req.session.user?.role.includes(Role.ADMIN)) {
				throw new AuthenticationError(
					"You don't have permissions for this action"
				);
			}
			return prisma.user.findUnique({ where: { id: id } });
		},
		showMe: (parent: any, args: undefined, { req }: { req: Request }) => {
			if (!req.session.user) {
				// throw new AuthenticationError(
				// 	"Your session is expired. Please log in to continue."
				// );
				return undefined;
			}
			return req.session.user;
		},
	},
	Mutation: {
		updateUser: async (
			parent: any,
			{ input }: { input: UpdateUserInput },
			{ req }: { req: Request }
		) => {
			if (
				req.user?.user.id !== input.id ||
				!req.session.user?.role.includes(Role.ADMIN)
			) {
				throw new AuthenticationError(
					"You don't have permissions for this action"
				);
			}
			await prisma.user.update({
				where: { id: input.id },
				data: input,
			});
			return true;
		},
		deleteUser: async (
			parent: any,
			args: MutationDeleteUserArgs,
			{ req }: { req: Request }
		) => {
			if (!req.session.user?.role.includes(Role.ADMIN)) {
				throw new AuthenticationError(
					"You don't have permissions for this action"
				);
			}
			await prisma.user.delete({ where: { id: args.id } });
			return true;
		},
		logout: (
			parent: any,
			args: undefined,
			{ req, res }: { req: Request; res: Response }
		) => {
			if (req.session) {
				//deletes from session from Redis too
				req.session.destroy((err: any) => {
					if (err) {
						return false;
					}
				});
			}
			res.clearCookie("sid");
			return true;
		},
	},
};

export default userResolvers;
