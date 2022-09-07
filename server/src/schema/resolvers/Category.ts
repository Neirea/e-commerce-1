import { GraphQLScalarType, Kind } from "graphql";
import { PrismaClient, Category } from "@prisma/client";
import GraphQLJSON from "graphql-type-json";

const prisma = new PrismaClient({ log: ["query"] });

const categoryResolvers = {
	Query: {
		categories: () => {
			const categories = prisma.$queryRaw`SELECT * FROM public."Category";`;

			return categories;
			//add error handling
			if (categories) return { categories: categories };
			return { message: "There was an Error" };
		},
	},
	Mutation: {
		createCategory: (parent: any, args: any) => {
			const category = args.input;
			return prisma.category.create({ data: category });
		},
		updateCategory: (parent: any, args: any) => {
			const { id: category_id, parent_id, name } = args.input;
			return prisma.category.update({
				where: { id: category_id },
				data: { parent_id, name },
			});
		},
		deleteCategory: (parent: any, args: any) => {
			const { id } = args;
			console.log("ID=", id);

			prisma.category
				.delete({ where: { id: +id } })
				.catch((err) => console.log(err));

			return true;
		},
	},
};

export default categoryResolvers;
