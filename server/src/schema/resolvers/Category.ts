import { PrismaClient } from "@prisma/client";
import {
	CreateCategoryInput,
	UpdateCategoryInput,
} from "../../generated/graphql";

const prisma = new PrismaClient({ log: ["query"] });

const categoryResolvers = {
	Query: {
		categories: () => {
			return prisma.$queryRaw`SELECT * FROM public."Category";`;
		},
	},
	Mutation: {
		createCategory: (
			parent: any,
			{ input }: { input: CreateCategoryInput }
		) => {
			return prisma.category.create({ data: input });
		},
		updateCategory: (
			parent: any,
			{ input }: { input: UpdateCategoryInput }
		) => {
			const { id: category_id, parent_id, name } = input;
			return prisma.category.update({
				where: { id: category_id },
				data: { parent_id, name },
			});
		},
		deleteCategory: async (parent: any, { id }: { id: number }) => {
			const data = await prisma.category
				.delete({ where: { id: +id } })
				.catch((err) => console.log(err));

			if (data) return true;
			return false;
		},
	},
};

export default categoryResolvers;
