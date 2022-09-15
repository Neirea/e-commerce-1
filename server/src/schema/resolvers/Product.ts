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
			return prisma.product.findMany({
				include: { company: true, category: true, images: true },
				orderBy: { name: "asc" },
			});
			// return prisma.$queryRaw`SELECT * FROM public."Product";`;
		},
		product: (parent: any, { id }: { id: number }) => {
			return prisma.product.findUnique({
				where: { id: id },
				include: { company: true, category: true, images: true },
			});
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

			const newProduct = {
				category_id,
				company_id,
				description,
				price,
				name,
				inventory,
				shipping_cost,
				discount,
			};

			//create product and its images
			const productImages = input.img_id.map((img, i) => {
				return { img_id: img, img_src: input.img_src[i] };
			});
			await prisma.product.create({
				data: {
					...newProduct,
					images: {
						create: productImages,
					},
				},
			});
			//create connection between company and category
			await prisma.category.update({
				where: { id: category_id },
				data: {
					companies: { connect: { id: company_id } },
				},
			});
			return true;
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

			const updatedProduct = {
				category_id,
				company_id,
				description,
				price,
				name,
				inventory,
				shipping_cost,
				discount,
			};
			//delete old images
			if (input.img_id.length) {
				const oldImages = await prisma.productImage.findMany({
					where: { product_id: id },
				});
				//delete old ones
				await prisma.productImage.deleteMany({ where: { product_id: id } });
				oldImages.forEach(
					async (img) => await cloudinary.uploader.destroy(img.img_id)
				);
			}
			const productImages = input.img_id.map((img, i) => {
				return { img_id: img, img_src: input.img_src[i] };
			});
			await prisma.product.update({
				where: { id: id },
				data: {
					...updatedProduct,
					images: {
						create: productImages,
					},
				},
			});
			//update relationbetween company and category
			await prisma.category.update({
				where: { id: category_id },
				data: {
					companies: { connect: { id: company_id } },
				},
			});

			return true;
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
			const data = await prisma.product.delete({
				where: { id: id },
				include: { images: true },
			});

			if (data) {
				data.images.forEach(async (img) => {
					await cloudinary.uploader.destroy(img.img_id);
				});
				return true;
			}
			return false;
		},
	},
};

export default productResolvers;
