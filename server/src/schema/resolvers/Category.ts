import { GraphQLScalarType, Kind } from "graphql";
import { PrismaClient } from "@prisma/client";
import GraphQLJSON from "graphql-type-json";

const prisma = new PrismaClient({ log: ["query"] });

const categoryResolvers = {
	Query: {
		categories: (parent: any, args: any) => {
			const categories = prisma.$queryRaw`SELECT * FROM public."Category";`;
			console.log("products=", categories);

			return categories;
			//add error handling
			if (categories) return { categories: categories };
			return { message: "There was an Error" };
		},
	},
	Mutation: {
		createCategories: (parent: any, args: any) => {
			const category = args.input;

			return prisma.category.create({ data: category });
		},
		updateCategory: (parent: any, args: any) => {
			const category_id = args.input.id;
			return prisma.category.update({
				where: { id: category_id },
				data: { ...args.input }, // probably wrong #any
			});
		},
		deleteCategory: (parent: any, args: any) => {
			return prisma.category.delete({ where: { id: args.id } });
		},
	},
};

export default categoryResolvers;
