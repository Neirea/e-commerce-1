import { PrismaClient, Role } from "@prisma/client";
import GraphQLJSON from "graphql-type-json";
import {
	CreateProductInput,
	UpdateProductInput,
} from "../../generated/graphql";
import { Request } from "express";
import { v2 as cloudinary } from "cloudinary";
import { AuthenticationError, UserInputError } from "apollo-server-express";

const prisma = new PrismaClient({ log: ["query"] });

const productResolvers = {
	JSON: GraphQLJSON,
	Query: {
		products: () => {
			return prisma.product.findMany();
			// return prisma.product.findMany({ include: { company: true } });
			// return prisma.$queryRaw`SELECT * FROM public."Product";`;
		},
	},
	Mutation: {
		createProduct: async (
			parent: any,
			{ input }: { input: CreateProductInput },
			{ req }: { req: Request }
		) => {
			if (!req.session.user?.role.includes(Role.ADMIN)) {
				throw new AuthenticationError(
					"You don't have permissions for this action"
				);
			}
			const {
				category_id,
				company_id,
				description,
				price,
				name,
				inventory,
				shipping_cost,
				discount,
			} = input;
			if (name.length < 3) throw new UserInputError("Name is too short");

			const arrOfImgs = input.img_id.map((item, i) => {
				return { img_id: item, img_src: input.img_src[i] };
			});

			const newProduct = {
				category_id,
				company_id,
				description,
				price,
				name,
				inventory,
				shipping_cost,
				discount,
				images: arrOfImgs,
			};

			const product = await prisma.product
				.create({ data: newProduct })
				.catch(() => {
					input.img_id.forEach((id) => cloudinary.uploader.destroy(id!));
				});

			//create connection between company and category
			await prisma.category.update({
				where: { id: category_id },
				data: {
					companies: { connect: { id: company_id } },
				},
			});
			return product;
		},
		updateProduct: async (
			parent: any,
			{ input }: { input: UpdateProductInput },
			{ req }: { req: Request }
		) => {
			if (!req.session.user?.role.includes(Role.ADMIN)) {
				throw new AuthenticationError(
					"You don't have permissions for this action"
				);
			}
			const {
				id,
				category_id,
				company_id,
				description,
				price,
				name,
				inventory,
				shipping_cost,
				discount,
			} = input;
			if (name.length < 3) throw new UserInputError("Name is too short");

			const arrOfImgs =
				input.img_id.length > 0
					? input.img_id.map((item, i) => {
							return { img_id: item, img_src: input.img_src[i] };
					  })
					: undefined;

			const updatedProduct = {
				category_id,
				company_id,
				description,
				price,
				name,
				inventory,
				shipping_cost,
				discount,
				images: arrOfImgs,
			};

			const product = await prisma.product
				.update({
					where: { id: id },
					data: updatedProduct, // probably wrong #any
				})
				.catch(() => {
					input.img_id.forEach((id) => cloudinary.uploader.destroy(id!));
				});
			await prisma.category.update({
				where: { id: category_id },
				data: {
					companies: { connect: { id: company_id } },
				},
			});
			return product;
		},
		deleteProduct: async (
			parent: any,
			{ id }: { id: number },
			{ req }: { req: Request }
		) => {
			if (!req.session.user?.role.includes(Role.ADMIN)) {
				throw new AuthenticationError(
					"You don't have permissions for this action"
				);
			}
			const data = await prisma.product.delete({ where: { id: id } });

			if (data) {
				(data.images as any[]).forEach((item) => {
					cloudinary.uploader.destroy(item.img_id!);
				});
				return true;
			}
			return false;
		},
	},
};

export default productResolvers;
