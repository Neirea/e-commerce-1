import type { Request } from "express";
import { PrismaClient } from "@prisma/client";
import GraphQLJSON from "graphql-type-json";
import { CreateProductInput } from "../../generated/graphql";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient({ log: ["query"] });

const productResolvers = {
	JSON: GraphQLJSON,
	Query: {
		products: () => {
			return prisma.product.findMany({ include: { company: true } });
			// return prisma.$queryRaw`SELECT * FROM public."Product";`;
		},
	},
	Mutation: {
		createProduct: async (
			parent: any,
			{ input }: { input: CreateProductInput },
			{ req }: { req: Request }
		) => {
			// 0.5. check for user role (same in company,category) - middleware
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

			//create connection between company and category
			await prisma.category.update({
				where: { id: input.category_id },
				data: {
					companies: { connect: { id: input.company_id } },
				},
			});

			return prisma.product.create({ data: newProduct }).catch(() => {
				input.img_id.forEach((id) => cloudinary.uploader.destroy(id!));
			});
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
