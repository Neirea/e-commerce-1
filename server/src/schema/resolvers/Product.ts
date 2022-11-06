import { Prisma, PrismaClient, Role } from "@prisma/client";
import { AuthenticationError, UserInputError } from "apollo-server-express";
import { v2 as cloudinary } from "cloudinary";
import { Request } from "express";
import GraphQLJSON from "graphql-type-json";
import type {
    Category,
    Company,
    CreateProductInput,
    QueryProductInput,
    QueryRelatedInput,
    QuerySearchDataInput,
    UpdateProductInput,
} from "../../generated/graphql";

const prisma = new PrismaClient();

const subCategoriesQuery = (
    category_id: number
) => Prisma.sql`WITH RECURSIVE subcategory AS (
    SELECT ctg.id,ctg.name,ctg.parent_id FROM public."Category" AS ctg WHERE parent_id IS NULL AND id = ${category_id}
UNION ALL
    SELECT sc.id,sc.name,sc.parent_id FROM public."Category" sc
    JOIN subcategory subcat
    ON sc.parent_id = subcat.id
)
SELECT subcategory.id FROM subcategory;`;

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
        productsById: (parent: any, { ids }: { ids: Array<number> }) => {
            if (!ids.length || !ids) return [];
            return prisma.product.findMany({
                where: {
                    id: { in: ids },
                },
                include: {
                    images: true,
                },
            });
        },
        searchData: async (
            parent: any,
            { input }: { input: QuerySearchDataInput }
        ) => {
            const searchString = input.search_string
                ? input.search_string
                      .split(" ")
                      .map((s) => s + ":*")
                      .join(" | ")
                : undefined;

            const searchCategoryIds: number[] = [];
            if (input.category_id) {
                await prisma.$queryRaw<{ id: number }[]>`
                    ${subCategoriesQuery(input.category_id)}
                    `.then((res) =>
                    res.forEach((i) => searchCategoryIds.push(i.id))
                );
            }

            const data = await prisma.product.findMany({
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
                    ],
                    company_id: input.company_id ?? undefined,
                    category_id: searchCategoryIds.length
                        ? { in: searchCategoryIds }
                        : input.category_id ?? undefined,
                },
                select: {
                    price: true,
                    discount: true,
                    category: {
                        include: { parent: true },
                    },
                    company: true,
                },
            });

            let min = 2147483647; //max 32bit integer
            let max = 0;
            type ICategory = Category & {
                parent?: Category | null;
            };
            const allCategories: Array<ICategory> = [];
            const allCompanies: Array<Company> = [];
            const maxPrice = input.max_price ?? 2147483647;
            const minPrice = input.min_price ?? 0;
            data.forEach((p) => {
                const price = ((100 - p.discount) / 100) * p.price;
                if (price < min) min = price;
                if (price > max) max = price;
                if (input.max_price || input.min_price) {
                    if (price <= maxPrice && price >= minPrice) {
                        allCategories.push(p.category);
                        allCompanies.push(p.company);
                    }
                } else {
                    allCategories.push(p.category);
                    allCompanies.push(p.company);
                }
            });
            //push parent categories
            allCategories.forEach((elem) => {
                if (elem.parent && elem.parent.id != null) {
                    allCategories.push(elem.parent);
                }
                delete elem.parent;
            });

            //get unique categories, companies
            const categories = [
                ...new Map(
                    allCategories.map((item) => [item["id"], item])
                ).values(),
            ];
            const companies = [
                ...new Map(
                    allCompanies.map((item) => [item["id"], item])
                ).values(),
            ];

            // count products per category, company
            const catCount: { [key: string]: number } = {};
            allCategories.forEach(function (x) {
                catCount[x.id] = (catCount[x.id] || 0) + 1;
            });
            const compCount: { [key: string]: number } = {};
            allCompanies.forEach(function (x) {
                compCount[x.id] = (compCount[x.id] || 0) + 1;
            });
            categories.forEach((elem) => {
                elem.productCount = catCount[elem.id];
            });
            companies.forEach((elem) => {
                elem.productCount = compCount[elem.id];
            });
            if (min === 2147483647) min = 0;
            return {
                min: Math.floor(min),
                max: Math.floor(max),
                categories,
                companies,
            };
        },
        filteredProducts: async (
            parent: any,
            {
                offset,
                limit,
                input,
            }: { offset: number; limit: number; input: QueryProductInput }
        ) => {
            const searchString = input.search_string
                ? input.search_string
                      .split(" ")
                      .map((s) => s + ":*")
                      .join(" | ")
                : undefined;
            let sortBy: {
                orders?: { _count: "desc" | "asc" };
                price?: "desc" | "asc";
            } = {
                orders: {
                    _count: "desc",
                },
            };
            if (input.sortMode === 1) {
                sortBy = {
                    price: "asc",
                };
            }
            if (input.sortMode === 2) {
                sortBy = {
                    price: "desc",
                };
            }
            const searchCategoryIds: number[] = [];

            if (input.category_id) {
                await prisma.$queryRaw<{ id: number }[]>`
                    ${subCategoriesQuery(input.category_id)}
                    `.then((res) =>
                    res.forEach((i) => searchCategoryIds.push(i.id))
                );
            }
            const data = await prisma.product.findMany({
                skip: offset,
                take: limit,
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
                    ],
                    company_id: input.company_id ?? undefined,
                    category_id: searchCategoryIds.length
                        ? { in: searchCategoryIds }
                        : input.category_id ?? undefined,
                    price: {
                        gte: input.min_price ?? undefined,
                        lte: input.max_price ?? undefined,
                    },
                },
                include: {
                    images: true,
                    category: {
                        include: {
                            _count: {
                                select: {
                                    products: true,
                                },
                            },
                        },
                    },
                    company: true,
                    _count: {
                        select: {
                            orders: true,
                        },
                    },
                },
                orderBy: sortBy,
            });

            return data;
        },
        featuredProducts: (
            parent: any,
            { limit, offset }: { limit: number; offset: number }
        ) => {
            return prisma.product.findMany({
                skip: offset,
                take: limit,
                include: {
                    images: true,
                },
                orderBy: {
                    discount: "desc",
                },
            });
        },
        relatedProducts: async (
            parent: any,
            {
                limit,
                offset,
                input,
            }: { limit: number; offset: number; input: QueryRelatedInput }
        ) => {
            const showFirst = await prisma.product.findMany({
                where: {
                    NOT: { id: input.id },
                    company_id: input.company_id,
                    category_id: input.category_id,
                },
                skip: offset,
                take: limit,
                include: {
                    images: true,
                },
            });
            if (showFirst.length === limit) return showFirst;
            const count = await prisma.product.count({
                where: {
                    NOT: { id: input.id },
                    company_id: input.company_id,
                    category_id: input.category_id,
                },
            });

            const offSet = offset - count < 0 ? 0 : offset - count;
            const showSecond = await prisma.product.findMany({
                where: {
                    NOT: {
                        company_id: input.company_id,
                    },
                    category_id: input.category_id,
                },
                skip: offSet,
                take: limit - showFirst.length,
                include: {
                    images: true,
                },
            });

            return showFirst.concat(showSecond);
        },
        popularProducts: (
            parent: any,
            { limit, offset }: { limit: number; offset: number }
        ) => {
            return prisma.product.findMany({
                skip: offset,
                take: limit,
                include: {
                    images: true,
                    _count: {
                        select: { orders: true },
                    },
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
            if (input.name.length < 3)
                throw new UserInputError("Name is too short");

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
            if (input.name.length < 3)
                throw new UserInputError("Name is too short");

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
