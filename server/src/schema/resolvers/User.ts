import { GraphQLScalarType, Kind } from "graphql";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
	MutationDeleteUserArgs,
	UpdateUserInput,
} from "../../generated/graphql";

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
		users: () => {
			return prisma.user.findMany();
			// return prisma.$queryRaw`SELECT * FROM public."User";`;
		},
		user: (parent: any, { id }: { id: number }) => {
			return prisma.user.findMany({ where: { id: id } });
		},
		showMe: (parent: any, args: undefined, { req }: { req: Request }) => {
			return req.session.user;
		},
	},
	Mutation: {
		updateUser: (parent: any, { input }: { input: UpdateUserInput }) => {
			//update with data from front-end(either admin page or client's profile page)
			return prisma.user.update({
				where: { id: input.id },
				data: input,
			});
		},
		deleteUser: (parent: any, args: MutationDeleteUserArgs) => {
			return prisma.user.delete({ where: { id: args.id } });
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
