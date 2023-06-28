import { Prisma } from "@prisma/client";
import {
    getCategoryCondition,
    getCompanyCondition,
    getSearchCondition,
    imagesJSON,
    productsByOrderCount,
} from "./queries/utils";
import { ProductsByIdsDto } from "./dto/products-by-ids.dto";
import { parseQueryString } from "src/common/parse-querystring";
import { SearchDataDto } from "./dto/search-data.dto";
import { FeaturedProductsDto } from "./dto/featured-products.dto";
import { RelatedProductsDto } from "./dto/related-products.dto";
import { PopularProductsDto } from "./dto/popular-products.dto";
import { CreateProductDto } from "./dto/create-propduct.dto";

export const getProducts = Prisma.sql`
    SELECT p.*,
    COALESCE(json_agg(json_build_object('id',v."B"))
    FILTER (WHERE v."B" IS NOT NULL),'[]') as variants
    FROM public."Product" as p
    LEFT JOIN public."_variants" as v ON p.id = v."A"
    GROUP BY p.id
    ORDER BY p.id
`;

export const getProductByIdQuery = (id: number) => {
    const variantsJSON = Prisma.sql`
        SELECT p.id,json_agg(json_build_object('id',vrn.id,'name',p.name,'images',vrn.images)) as variants
        FROM public."Product" as p
        INNER JOIN
            (SELECT DISTINCT v."A" as product_id, v."B" as id,i.images 
            FROM public."_variants" as v
            INNER JOIN (${imagesJSON}) as i
            ON v."B" = i.product_id) as vrn
        ON p.id = vrn.product_id
        WHERE p.id = ${id}
        GROUP BY p.id
    `;
    return Prisma.sql`
        SELECT p.*,i.images,
        json_build_object('id',com.id,'name',com.name) as company,
        json_build_object('id',cat.id,'name',cat.name) as category,
        COALESCE(vrn.variants,'[]') as variants
        FROM public."Product" as p
        INNER JOIN (${imagesJSON}) as i ON p.id = i.product_id
        INNER JOIN public."Category" as cat ON p.category_id = cat.id
        INNER JOIN public."Company" as com ON p.company_id = com.id
        LEFT JOIN (${variantsJSON}) as vrn ON p.id = vrn.id
        WHERE p.id = ${id}
    `;
};

export const getProductsByIdsQuery = (input: ProductsByIdsDto) => Prisma.sql`
    SELECT p.*,i.images
    FROM public."Product" as p
    INNER JOIN (${imagesJSON}) as i
    ON p.id = i.product_id
    WHERE p.id IN (${Prisma.join(input.ids)})
`;

export const getSearchDataQuery = (
    input: SearchDataDto,
    categoryIds: number[],
) => {
    const searchString = parseQueryString(input.search_string);
    const searchCondition = getSearchCondition(searchString);
    const companyCondition = getCompanyCondition(input.company_id);
    const categoryCondition = getCategoryCondition(
        categoryIds,
        input.category_id,
    );

    const categoriesJSON = Prisma.sql`
            SELECT cat.*,pcat.parent
            FROM  public."Category" as cat
            LEFT JOIN (SELECT c1.*, json_build_object('id',c2.id,'name',c2.name) as parent
                    FROM public."Category" as c1, public."Category" as c2
                    WHERE c1.parent_id = c2.id) as pcat
            ON cat.id = pcat.id
        `;

    return Prisma.sql`
            SELECT p.price, p.discount, p.category_id,
                json_build_object('id',com.id,'name',com.name) as company,
                json_build_object('id',cat.id,'name',cat.name,'parent',cat.parent,'parent_id',cat.parent_id) as category
            FROM public."Product" as p
            INNER JOIN public."Company" as com ON p.company_id = com.id
            INNER JOIN (${categoriesJSON}) as cat ON p.category_id = cat.id
            WHERE (${searchCondition})
                ${companyCondition}
                ${categoryCondition}
        `;
};

export const filteredProductsQuery = (input: any, categoryIds: number[]) => {
    const { offset, limit, product } = input;
    const orderCondition =
        product.sort_mode === 1
            ? Prisma.sql`p.inventory != 0 DESC, p.price ASC,p._count DESC, p.id ASC`
            : product.sort_mode === 2
            ? Prisma.sql`p.inventory != 0 DESC, p.price DESC,p._count DESC, p.id ASC`
            : Prisma.sql`p.inventory != 0 DESC, p._count DESC,p.discount DESC, p.id ASC`;

    const searchString = parseQueryString(product.search_string);
    const searchCondition = getSearchCondition(searchString);
    const companyCondition = getCompanyCondition(product.company_id);
    const categoryCondition = getCategoryCondition(
        categoryIds,
        product.category_id,
    );

    const minPriceCondition = product.min_price
        ? Prisma.sql`AND p.price >= ${product.min_price}`
        : Prisma.empty;

    const maxPriceCondition = product.max_price
        ? Prisma.sql`AND p.price <= ${product.max_price}`
        : Prisma.empty;

    return Prisma.sql`
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

export const featuredProductsQuery = (input: FeaturedProductsDto) => Prisma.sql`
    SELECT p.*,pi.images
    FROM public."Product" as p
    INNER JOIN (${imagesJSON}) as pi
    ON p.id = pi.product_id
    ORDER BY p.inventory != 0 DESC, p.discount DESC, p.id ASC
    LIMIT ${input.limit} OFFSET ${input.offset}
`;

export const relatedProductsQuery = (input: RelatedProductsDto) => Prisma.sql`
    SELECT po.*,pi.images
    FROM (${productsByOrderCount}) as po
    INNER JOIN (${imagesJSON}) as pi
    ON po.id = pi.product_id
    WHERE NOT po.id = ${input.product.id} AND (po.company_id = ${input.product.company_id} OR po.category_id = ${input.product.category_id})
    ORDER BY po.inventory != 0 DESC, 
    CASE WHEN po.company_id = ${input.product.company_id} THEN 1 ELSE 2 END ASC,
    po._count DESC, po.id ASC
    LIMIT ${input.limit} OFFSET ${input.offset}
`;

export const popularProductsQuery = (input: PopularProductsDto) => Prisma.sql`
    SELECT pi.images,po.*
    FROM (${productsByOrderCount}) as po
    INNER JOIN (${imagesJSON}) as pi
    ON po.id = pi.product_id
    ORDER BY po.inventory != 0 DESC, po._count DESC,po.id ASC
    LIMIT ${input.limit} OFFSET ${input.offset}
`;

export const searchBarDataQuery = (input: string) => {
    const searchString = parseQueryString(input);

    return Prisma.sql`
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

export const updateProductCategoryQuery = (
    input: CreateProductDto,
) => Prisma.sql`
    INSERT INTO public."_CategoryToCompany" ("A","B")
    VALUES (${input.category_id},${input.company_id})
    ON CONFLICT DO NOTHING
`;
