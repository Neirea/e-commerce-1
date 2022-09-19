import { PrismaClient, Role } from "@prisma/client";
import { AuthenticationError, UserInputError } from "apollo-server-express";
import { v2 as cloudinary } from "cloudinary";
import { Request } from "express";
import {
	CreateCategoryInput,
	UpdateCategoryInput,
} from "../../generated/graphql";

const prisma = new PrismaClient({ log: ["query"] });

const categoryResolvers = {
	Query: {
		categories: () => {
			return prisma.category.findMany({
				include: { companies: true, parent: true },
				orderBy: { name: "asc" },
			});
			//return prisma.$queryRaw`SELECT * FROM public."Category";`;
		},
	},
	Mutation: {
		createCategory: async (
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
			await prisma.category.create({ data: input });
			return true;
		},
		updateCategory: async (
			parent: any,
			{ input }: { input: UpdateCategoryInput },
			{ req }: { req: Request }
		) => {
			if (!req.session.user?.role.includes(Role.ADMIN)) {
				throw new AuthenticationError(
					"You don't have permissions for this action"
				);
			}
			const { id: category_id, parent_id, name, img_id, img_src } = input;

			const oldCategory = await prisma.category.findUnique({
				where: { id: category_id },
			});

			await prisma.category.update({
				where: { id: category_id },
				data: { parent_id, name, img_id, img_src },
			});

			if (oldCategory?.img_id && img_id) {
				await cloudinary.uploader.destroy(oldCategory?.img_id);
			}
			return true;
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
			const data = await prisma.category.delete({ where: { id: id } });
			if (data.img_id) {
				await cloudinary.uploader.destroy(data.img_id);
				return true;
			}
			return false;
		},
	},
};

export default categoryResolvers;
