import { Prisma } from "@prisma/client";
import { QueryProductInput } from "../../../generated/graphql";
import prisma from "../../../prisma";
import {
    getCategoryCondition,
    getCompanyCondition,
    getSearchCondition,
    imagesJSON,
    productsByOrderCount,
    subCategoriesQuery,
} from "../sql/Product";
import { getQueryString } from "./utils";

export default async (
    parent: any,
    {
        offset,
        limit,
        input,
    }: { offset: number; limit: number; input: QueryProductInput }
) => {
    const searchString = getQueryString(input.search_string);
    const searchCategoryIds: number[] = [];
    if (input.category_id) {
        const res = await prisma.$queryRaw<{ id: number }[]>`
            ${subCategoriesQuery(input.category_id)}
            `;
        res.forEach((i) => searchCategoryIds.push(i.id));
    }

    const orderCondition =
        input.sortMode === 1
            ? Prisma.sql`p.inventory != 0 DESC, p.price ASC,p._count DESC, p.id ASC`
            : input.sortMode === 2
            ? Prisma.sql`p.inventory != 0 DESC, p.price DESC,p._count DESC, p.id ASC`
            : Prisma.sql`p.inventory != 0 DESC, p._count DESC,p.discount DESC, p.id ASC`;

    const searchCondition = getSearchCondition(searchString);
    const companyCondition = getCompanyCondition(input.company_id);
    const categoryCondition = getCategoryCondition(
        searchCategoryIds,
        input.category_id
    );

    const minPriceCondition = input.min_price
        ? Prisma.sql`AND p.price >= ${input.min_price}`
        : Prisma.empty;

    const maxPriceCondition = input.max_price
        ? Prisma.sql`AND p.price <= ${input.max_price}`
        : Prisma.empty;

    return prisma.$queryRaw`
        SELECT p.*,pi.images
        FROM (${productsByOrderCount}) as p
        INNER JOIN (${imagesJSON}) as pi
        ON p.id = pi.product_id
        INNER JOIN public."Company" as com
        ON p.company_id = com.id
        INNER JOIN public."Category" as cat
        ON p.category_id = cat.id
        WHERE (${searchCondition})
            ${companyCondition}
            ${categoryCondition}
            ${minPriceCondition}
            ${maxPriceCondition}
        ORDER BY ${orderCondition}
        LIMIT ${limit} OFFSET ${offset}
    `;
};
