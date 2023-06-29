import { Prisma } from "@prisma/client";
import { CateogoryId } from "src/modules/category/category.types";
import { CompanyId } from "src/modules/company/company.types";

export const subCategoriesQuery = (category_id: CateogoryId) => Prisma.sql`
    WITH RECURSIVE subcategory AS (
        SELECT ctg.id,ctg.parent_id FROM public."Category" AS ctg WHERE parent_id IS NULL AND id = ${category_id}
    UNION ALL
        SELECT sc.id,sc.parent_id FROM public."Category" sc
        JOIN subcategory subcat
        ON sc.parent_id = subcat.id
    )
    SELECT subcategory.id FROM subcategory;
`;

export const productsByOrderCount = Prisma.sql`
    SELECT p.*,COUNT(CASE o.status WHEN 'ACCEPTED' THEN 1 ELSE NULL END) as _count
    FROM public."Product" as p
    LEFT JOIN public."SingleOrderItem" as s ON p.id = s.product_id
    LEFT JOIN public."Order" as o ON s.order_id = o.id
    GROUP BY p.id
`;

export const imagesJSON = Prisma.sql`
    SELECT product_id,jsonb_agg(jsonb_build_object('img_id',img_id,'img_src',img_src)) as images
    FROM public."ProductImage" GROUP BY product_id
`;

export const getSearchCondition = (searchString: string | undefined) =>
    searchString
        ? Prisma.sql`(to_tsvector('simple',p.name) @@ to_tsquery('simple',${searchString})
OR to_tsvector('simple',com.name) @@ to_tsquery('simple',${searchString})
OR to_tsvector('simple',cat.name) @@ to_tsquery('simple',${searchString}))`
        : Prisma.sql`TRUE`;

export const getCompanyCondition = (id: CompanyId) =>
    id ? Prisma.sql`AND p.company_id = ${id}` : Prisma.empty;

export const getCategoryCondition = (ids: number[], id: CateogoryId) =>
    ids.length
        ? Prisma.sql`AND p.category_id IN (${Prisma.join(ids)})`
        : id
        ? Prisma.sql`AND p.category_id = ${id}`
        : Prisma.empty;
