import { PrismaClient, Role } from "@prisma/client";
import { AuthenticationError, UserInputError } from "apollo-server-express";
import { v2 as cloudinary } from "cloudinary";
import { Request } from "express";
import GraphQLJSON from "graphql-type-json";
import type {
	CreateProductInput,
	QueryProductInput,
	UpdateProductInput,
} from "../../generated/graphql";

const prisma = new PrismaClient({ log: ["query"] });

const productResolvers = {
	JSON: GraphQLJSON,
	Query: {
		products: () => {
			return prisma.product.findMany({
				include: {
					company: true,
					category: true,
					images: true,
					variants: {
						include: {
							images: true,
						},
					},
				},
				orderBy: { name: "asc" },
			});
		},
		product: (parent: any, { id }: { id: number }) => {
			return prisma.product.findUnique({
				where: { id: id },
				include: {
					company: true,
					category: true,
					images: true,
					variants: {
						include: {
							images: true,
						},
					},
				},
			});
		},
		filteredProducts: (
			parent: any,
			{ input }: { input: QueryProductInput }
		) => {
			const searchString = input.search_string
				? input.search_string + ":*"
				: undefined;

			return prisma.product.findMany({
				where: {
					OR: [
						{
							name: {
								search: searchString,
							},
						},
						{
							category: {
								name: {
									search: searchString,
								},
							},
						},
						{
							company: {
								name: {
									search: searchString,
								},
							},
						},
						{
							description: {
								path: ["OS"],
								string_contains: input.search_string ?? undefined,
							},
						},
					],
					company_id: input.company_id ?? undefined,
					category_id: input.category_id ?? undefined,
					price: {
						gte: input.min_price ?? undefined,
						lte: input.max_price ?? undefined,
					},
				},
				include: {
					images: true,
				},
			});
		},
		featuredProducts: () => {
			return prisma.product.findMany({
				include: {
					images: true,
				},
				orderBy: {
					discount: "desc",
				},
			});
		},
		popularProducts: () => {
			return prisma.product.findMany({
				include: {
					images: true,
				},
				orderBy: {
					orders: {
						_count: "desc",
					},
				},
			});
		},
	},
	Mutation: {
		createProduct: async (
			parent: any,
			{ input }: { input: CreateProductInput },
			{ req }: { req: Request }
		) => {
			if (!req.session.user?.role.includes(Role.EDITOR)) {
				throw new AuthenticationError(
					"You don't have permissions for this action"
				);
			}
			const { variants, img_id, img_src, ...createData } = input;
			if (input.name.length < 3) throw new UserInputError("Name is too short");

			//create product, create product images and connection to variants
			const connectArr = variants?.map((p_id) => {
				return { id: p_id };
			});
			const productImages = img_id.map((img, i) => {
				return { img_id: img, img_src: img_src[i] };
			});

			await prisma.product.create({
				data: {
					...createData,
					images: {
						create: productImages,
					},
					variants: {
						connect: connectArr,
					},
					variantsRelation: {
						connect: connectArr,
					},
				},
			});

			//create connection between company and category
			await prisma.category.update({
				where: { id: input.category_id },
				data: {
					companies: { connect: { id: input.company_id } },
				},
			});
			return true;
		},
		updateProduct: async (
			parent: any,
			{ input }: { input: UpdateProductInput },
			{ req }: { req: Request }
		) => {
			if (!req.session.user?.role.includes(Role.EDITOR)) {
				throw new AuthenticationError(
					"You don't have permissions for this action"
				);
			}
			const { id, variants, img_id, img_src, ...updateData } = input;
			if (input.name.length < 3) throw new UserInputError("Name is too short");

			//delete old images
			if (input.img_id.length) {
				const oldImages = await prisma.productImage.findMany({
					where: { product_id: id },
				});
				oldImages.forEach(
					async (img) => await cloudinary.uploader.destroy(img.img_id)
				);
				await prisma.productImage.deleteMany({
					where: { product_id: id },
				});
			}

			//update product, create product images and connection to variants
			const connectArr = variants?.map((p_id) => {
				return { id: p_id };
			});
			const productImages = img_id.map((img, i) => {
				return { img_id: img, img_src: img_src[i] };
			});

			await prisma.product.update({
				where: { id: id },
				data: {
					...updateData,
					images: {
						create: productImages,
					},
					variants: {
						connect: connectArr,
					},
					variantsRelation: {
						connect: connectArr,
					},
				},
			});
			//update relationbetween company and category
			await prisma.category.update({
				where: { id: input.category_id },
				data: {
					companies: { connect: { id: input.company_id } },
				},
			});

			return true;
		},
		deleteProduct: async (
			parent: any,
			{ id }: { id: number },
			{ req }: { req: Request }
		) => {
			if (!req.session.user?.role.includes(Role.EDITOR)) {
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
