import { GraphQLScalarType, Kind } from "graphql";
import { PrismaClient } from "@prisma/client";
import GraphQLJSON from "graphql-type-json";

const prisma = new PrismaClient({ log: ["query"] });

const productResolvers = {
	JSON: GraphQLJSON,
	Query: {
		products: (parent: any, args: any, context: any) => {
			return prisma.product.findMany({ include: { company: true } });
			// return prisma.$queryRaw`SELECT * FROM public."Product";`;
		},
	},
	Mutation: {
		createProduct: (parent: any, args: any) => {
			const product = args.input;
			// upload images to cloudinary

			return prisma.product.create({ data: { ...product } });
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
