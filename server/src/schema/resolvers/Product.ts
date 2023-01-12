import { Prisma, Role } from "@prisma/client";
import { AuthenticationError, UserInputError } from "apollo-server-express";
import { v2 as cloudinary } from "cloudinary";
import { Request } from "express";
import GraphQLJSON from "graphql-type-json";
import type {
    CreateProductInput,
    Product,
    QueryRelatedInput,
    UpdateProductInput,
} from "../../generated/graphql";
import prisma from "../../prisma";
import filteredProductsQuery from "./queryFunctions/filteredProductsQuery";
import productQuery from "./queryFunctions/productQuery";
import searchBarQuery from "./queryFunctions/searchBarQuery";
import searchDataQuery from "./queryFunctions/searchDataQuery";
import { imagesJSON, productsByOrderCount } from "./sql/Product";

const productResolvers = {
    JSON: GraphQLJSON,
    Query: {
        products: async () => {
            return prisma.$queryRaw<Product[]>`
                SELECT p.*, 
                    COALESCE(json_agg(json_build_object('id',v."B"))
                    FILTER (WHERE v."B" IS NOT NULL),'[]') as variants
                FROM public."Product" as p
                LEFT JOIN public."_variants" as v ON p.id = v."A"
                GROUP BY p.id
                ORDER BY p.id
            `;
        },
        product: productQuery,
        productsById: async (parent: any, { ids }: { ids: Array<number> }) => {
            if (!ids.length || !ids) return [];

            return prisma.$queryRaw`
                SELECT p.*,i.images
                FROM public."Product" as p
                INNER JOIN (${imagesJSON}) as i
                ON p.id = i.product_id
                WHERE p.id IN (${Prisma.join(ids)})
            `;
        },
        searchData: searchDataQuery,
        filteredProducts: filteredProductsQuery,
        featuredProducts: async (
            parent: any,
            { limit, offset }: { limit: number; offset: number }
        ) => {
            return prisma.$queryRaw`
                SELECT p.*,pi.images
                FROM public."Product" as p
                INNER JOIN (${imagesJSON}) as pi
                ON p.id = pi.product_id
                ORDER BY p.inventory != 0 DESC, p.discount DESC, p.id ASC
                LIMIT ${limit} OFFSET ${offset}
            `;
        },
        relatedProducts: (
            parent: any,
            {
                limit,
                offset,
                input,
            }: { limit: number; offset: number; input: QueryRelatedInput }
        ) => {
            //get products with same company(ordered first) and same category
            return prisma.$queryRaw`
                SELECT po.*,pi.images FROM (${productsByOrderCount}) as po
                INNER JOIN (${imagesJSON}) as pi
                ON po.id = pi.product_id
                WHERE NOT po.id = ${input.id} AND (po.company_id = ${input.company_id} OR po.category_id = ${input.category_id})
                ORDER BY po.inventory != 0 DESC, 
                CASE WHEN po.company_id = ${input.company_id} THEN 1 ELSE 2 END ASC,
                po._count DESC, po.id ASC
                LIMIT ${limit} OFFSET ${offset}
            `;
        },
        popularProducts: (
            parent: any,
            { limit, offset }: { limit: number; offset: number }
        ) => {
            return prisma.$queryRaw`
                SELECT pi.images,po.*
                FROM (${productsByOrderCount}) as po
                INNER JOIN (${imagesJSON}) as pi
                ON po.id = pi.product_id
                ORDER BY po.inventory != 0 DESC, po._count DESC,po.id ASC
                LIMIT ${limit} OFFSET ${offset}
            `;
        },
        searchBarQuery: searchBarQuery,
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
            if (input.name.length < 3)
                throw new UserInputError("Name is too short");

            //create product, create product images and connection to variants
            const connectArr = variants?.map((p_id) => {
                return { id: p_id };
            });
            const productImages = img_id.map((img, i) => {
                return { img_id: img, img_src: img_src[i] };
            });

            const createProduct = prisma.product.create({
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
            const updateCategory = prisma.category.update({
                where: { id: input.category_id },
                data: {
                    companies: { connect: { id: input.company_id } },
                },
            });
            await Promise.all([createProduct, updateCategory]);
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
            if (input.name.length < 3)
                throw new UserInputError("Name is too short");

            //update product, create product images and connection to variants
            const newVariants = variants?.map((p_id) => {
                return { id: p_id };
            });
            const newProductImages = img_id.map((img, i) => {
                return { img_id: img, img_src: img_src[i] };
            });

            const productUpdate = prisma.product.update({
                where: { id: id },
                data: {
                    ...updateData,
                    images: {
                        create: newProductImages,
                    },
                    variants: {
                        connect: newVariants,
                    },
                    variantsRelation: {
                        connect: newVariants,
                    },
                },
            });
            //update relationbetween company and category
            const categoryUpdate = prisma.category.update({
                where: { id: input.category_id },
                data: {
                    companies: { connect: { id: input.company_id } },
                },
            });

            //delete old images
            if (img_id.length) {
                const oldImages = await prisma.productImage.findMany({
                    where: { product_id: id },
                });
                await prisma.productImage.deleteMany({
                    where: { product_id: id },
                });
                await cloudinary.api.delete_resources(
                    oldImages.map((i) => i.img_id)
                );
            }

            const promiseArray = [productUpdate, categoryUpdate];
            await Promise.all(promiseArray);

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

            if (data.images.length) {
                await cloudinary.api.delete_resources(
                    data.images.map((i) => i.img_id)
                );
                return true;
            }
            return false;
        },
    },
};

export default productResolvers;
