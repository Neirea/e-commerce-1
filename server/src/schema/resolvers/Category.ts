import { PrismaClient, Role } from "@prisma/client";
import { Request } from "express";
import {
	CreateCategoryInput,
	UpdateCategoryInput,
} from "../../generated/graphql";
import { AuthenticationError, UserInputError } from "apollo-server-express";

const prisma = new PrismaClient({ log: ["query"] });

const categoryResolvers = {
	Query: {
		categories: (parent: any, args: unknown, { req }: { req: Request }) => {
			if (!req.session.user?.role.includes(Role.ADMIN)) {
				throw new AuthenticationError(
					"You don't have permissions for this action"
				);
			}
			return prisma.category.findMany();
			//return prisma.$queryRaw`SELECT * FROM public."Category";`;
		},
	},
	Mutation: {
		createCategory: (
			parent: any,
			{ input }: { input: CreateCategoryInput },
			{ req }: { req: Request }
		) => {
			if (!req.session.user?.role.includes(Role.ADMIN)) {
				throw new AuthenticationError(
					"You don't have permissions for this action"
				);
			}
			if (input.name.length < 3) throw new UserInputError("Name is too short");
			return prisma.category.create({ data: input });
		},
		updateCategory: (
			parent: any,
			{ input }: { input: UpdateCategoryInput },
			{ req }: { req: Request }
		) => {
			if (!req.session.user?.role.includes(Role.ADMIN)) {
				throw new AuthenticationError(
					"You don't have permissions for this action"
				);
			}
			const { id: category_id, parent_id, name } = input;
			return prisma.category.update({
				where: { id: category_id },
				data: { parent_id, name },
			});
		},
		deleteCategory: async (
			parent: any,
			{ id }: { id: number },
			{ req }: { req: Request }
		) => {
			if (!req.session.user?.role.includes(Role.ADMIN)) {
				throw new AuthenticationError(
					"You don't have permissions for this action"
				);
			}
			const data = await prisma.category
				.delete({ where: { id: +id } })
				.catch((err) => console.log(err));

			if (data) return true;
			return false;
		},
	},
};

export default categoryResolvers;
