import { GraphQLScalarType, Kind } from "graphql";
import { PrismaClient } from "@prisma/client";
import GraphQLJSON from "graphql-type-json";

const prisma = new PrismaClient({ log: ["query"] });

const productResolvers = {
	JSON: GraphQLJSON,
	Query: {
		products: (parent: any, args: any, context: any) => {
			const products = prisma.$queryRaw`SELECT * FROM public."Product";`;
			console.log("products=", products);

			return products;
			//add error handling
			if (products) return { products: products };
			return { message: "There was an Error" };
		},
	},
	Mutation: {},
};

export default productResolvers;
