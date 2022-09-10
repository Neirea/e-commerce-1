import { PrismaClient } from "@prisma/client";
import GraphQLJSON from "graphql-type-json";
import {
	CreateProductInput,
	UpdateProductInput,
} from "../../generated/graphql";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient({ log: ["query"] });

interface ImageJSON {
	img_id: string;
	img_src: string;
}

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
			{ input }: { input: CreateProductInput }
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
				where: { id: category_id },
				data: {
					companies: { connect: { id: company_id } },
				},
			});

			return prisma.product.create({ data: newProduct }).catch(() => {
				input.img_id.forEach((id) => cloudinary.uploader.destroy(id!));
			});
		},
		updateProduct: (parent: any, { input }: { input: UpdateProductInput }) => {
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

			return prisma.product
				.update({
					where: { id: id },
					data: updatedProduct, // probably wrong #any
				})
				.catch(() => {
					input.img_id.forEach((id) => cloudinary.uploader.destroy(id!));
				});
		},
		deleteProduct: async (parent: any, { id }: { id: number }) => {
			const data = await prisma.product.delete({ where: { id: id } });

			if (data) {
				data.images.forEach((item) =>
					// cloudinary.uploader.destroy(item?.img_id!)
					console.log(true)
				);
				return true;
			}
			return false;
		},
	},
};

export default productResolvers;
