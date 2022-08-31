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
	Mutation: {
		createProduct: (parent: any, args: any) => {
			const product = args.input;

			return prisma.product.create({ data: product });
		},
		updateProduct: (parent: any, args: any) => {
			const product_id = args.input.id;
			return prisma.product.update({
				where: { id: product_id },
				data: { ...args.input }, // probably wrong #any
			});
		},
		deleteProduct: (parent: any, args: any) => {
			return prisma.product.delete({ where: { id: args.id } });
		},
	},
};

export default productResolvers;
