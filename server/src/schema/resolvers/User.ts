import { GraphQLScalarType, Kind } from "graphql";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["query"] });

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
		users: (parent: any, args: any) => {
			// const users = prisma.user.findMany();
			const users = prisma.$queryRaw`SELECT * FROM public."User";`;

			if (users) return { users: users };
			return { message: "There was an Error" };
		},
		user: (parent: any, args: any) => {
			return prisma.user.findMany({ where: { id: Number(args.id) } });
		},
		showMe: (parent: any, args: any, { req }: { req: any }) => {
			return req.session.user;
		},
	},
	Mutation: {
		createUser: (parent: any, args: any) => {
			const user = args.input;

			return prisma.user.create({ data: user });
			// return prisma.$queryRaw`INSERT INTO "public"."User" (Name,Username,Email,Avatar,Password) VALUES ${...user}`;
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

export default userResolvers;
