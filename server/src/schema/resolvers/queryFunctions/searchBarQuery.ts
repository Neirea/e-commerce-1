import prisma from "../../../prisma";
import { productsByOrderCount } from "../sql/Product";
import { getQueryString } from "./utils";

export default (parent: any, { input }: { input: string }) => {
    const searchString = getQueryString(input);

    return prisma.$queryRaw`
            (SELECT cat.id,cat.name,'Category' as source
            FROM public."Category" as cat
            WHERE to_tsvector('simple',cat.name) @@ to_tsquery('simple',${searchString})
            ORDER BY cat.id
            LIMIT 3)
        UNION ALL
            (SELECT com.id,com.name,'Company' as source
            FROM public."Company" as com
            WHERE to_tsvector('simple',com.name) @@ to_tsquery('simple',${searchString})
            ORDER BY com.id
            LIMIT 3)
        UNION ALL
            (SELECT p.id,p.name,'Product' as source
            FROM public."Product" as p
            INNER JOIN
                (${productsByOrderCount}) as po
            ON p.id = po.id
            WHERE to_tsvector('simple',p.name) @@ to_tsquery('simple',${searchString})
            ORDER BY po.inventory != 0 DESC, po._count DESC,po.id ASC)
        LIMIT ${10}
    `;
};
