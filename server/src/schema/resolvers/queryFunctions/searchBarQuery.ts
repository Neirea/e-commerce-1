import prisma from "../../../prisma";
import { productsByOrderCount } from "../sql/Product";
import { getQueryString } from "./utils";

export default async (parent: any, { input }: { input: string }) => {
    const searchString = getQueryString(input);

    return prisma.$queryRaw`
            (SELECT c.id,c.name,'Category' as source
            FROM public."Category" as c
            WHERE to_tsvector(c.name) @@ to_tsquery('english',${searchString})
            ORDER BY c.id
            LIMIT 3)
        UNION ALL
            (SELECT c.id,c.name,'Company' as source
            FROM public."Company" as c
            WHERE to_tsvector(c.name) @@ to_tsquery('english',${searchString})
            ORDER BY c.id
            LIMIT 3)
        UNION ALL
            (SELECT prod.id,prod.name,'Product' as source
            FROM public."Product" as prod
            INNER JOIN
                (${productsByOrderCount}) as po
            ON prod.id = po.id
            WHERE prod.name @@ to_tsquery('english',${searchString})
            ORDER BY po.inventory != 0 DESC, po._count DESC,po.id ASC)
        LIMIT ${10}
    `;
};
