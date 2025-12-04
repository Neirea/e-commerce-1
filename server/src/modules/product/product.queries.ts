import { Prisma } from "src/database/generated/client";
import {
    getCategoryCondition,
    getCompanyCondition,
    getSearchCondition,
    imagesJSON,
    productsByOrderCount,
} from "./utils/sql";
import { parseQueryString } from "src/common/parse-querystring";
import { FeaturedProductsDto } from "./dto/featured-products.dto";
import { RelatedProductsDto } from "./dto/related-products.dto";
import { PopularProductsDto } from "./dto/popular-products.dto";
import { CreateProductDto } from "./dto/create-propduct.dto";
import { TProductId } from "./product.types";
import { TCategoryId } from "../category/category.types";
import { SearchDataQueryDto } from "./dto/search-data.dto";
import { FilteredProductsQueryDto } from "./dto/filtered-products.dto";

export const getProducts = Prisma.sql`
    SELECT p.id,p.name,p.price,p.description,
        p.inventory,p.company_id,p.category_id,p.shipping_cost,
        p.discount,p.created_at,p.updated_at,
        COALESCE(json_agg(json_build_object('id',v."B")) FILTER (WHERE v."B" IS NOT NULL),'[]') as variants
    FROM public."Product" as p
    LEFT JOIN public."_variants" as v ON p.id = v."A"
    GROUP BY p.id
    ORDER BY p.id
`;

export const getProductByIdQuery = (id: TProductId): Prisma.Sql => {
    const variantsJSON = Prisma.sql`
        SELECT v."A" as product_id, json_agg(json_build_object(
            'id',v."B",
            'name',p.name,
            'images',i.images
            )) as variants
        FROM public."_variants" as v
        INNER JOIN (${imagesJSON}) as i ON v."B" = i.product_id
        INNER JOIN public."Product" as p ON v."B" = p.id
        GROUP BY v."A"
    `;
    return Prisma.sql`
        SELECT p.id,p.name,p.price,p.description,
            p.inventory,p.company_id,p.category_id,p.shipping_cost,
            p.discount,p.created_at,p.updated_at,i.images,
            json_build_object('id',com.id,'name',com.name) as company,
            json_build_object('id',cat.id,'name',cat.name) as category,
            COALESCE(vrn.variants,'[]') as variants
        FROM public."Product" as p
        INNER JOIN LATERAL (${imagesJSON}) as i ON p.id = i.product_id
        INNER JOIN public."Category" as cat ON p.category_id = cat.id
        INNER JOIN public."Company" as com ON p.company_id = com.id
        LEFT JOIN (${variantsJSON}) as vrn ON p.id = vrn.product_id
        WHERE p.id = ${id}
    `;
};

export const getProductsByIdsQuery = (
    ids: TProductId[],
): Prisma.Sql => Prisma.sql`
    SELECT p.id,p.name,p.price,p.description,
        p.inventory,p.company_id,p.category_id,p.shipping_cost,
        p.discount,p.created_at,p.updated_at,i.images
    FROM public."Product" as p
    INNER JOIN (${imagesJSON}) as i
    ON p.id = i.product_id
    WHERE p.id IN (${Prisma.join(ids)})
`;

export const getSearchDataQuery = (
    input: SearchDataQueryDto,
    TCategoryIds: TCategoryId[],
): Prisma.Sql => {
    const searchString = parseQueryString(input.search_string);
    const searchCondition = getSearchCondition(searchString);
    const companyCondition = getCompanyCondition(input.company_id);
    const categoryCondition = getCategoryCondition(
        TCategoryIds,
        input.category_id,
    );

    const categoriesJSON = Prisma.sql`
            SELECT cat.id,cat.name,cat.parent_id,cat.search_vector,pcat.parent
            FROM  public."Category" as cat
            LEFT JOIN (SELECT c1.id, json_build_object('id',c2.id,'name',c2.name) as parent
                    FROM public."Category" as c1, public."Category" as c2
                    WHERE c1.parent_id = c2.id) as pcat
            ON cat.id = pcat.id
        `;

    return Prisma.sql`
            SELECT p.price, p.discount,
                json_build_object('id',com.id,'name',com.name) as company,
                json_build_object('id',cat.id,'name',cat.name,'parent',cat.parent,'parent_id',cat.parent_id) as category
            FROM public."Product" as p
            INNER JOIN public."Company" as com ON p.company_id = com.id
            INNER JOIN (${categoriesJSON}) as cat ON p.category_id = cat.id
            WHERE ${searchCondition}
                ${companyCondition}
                ${categoryCondition}
        `;
};

export const filteredProductsQuery = (
    input: FilteredProductsQueryDto,
    TCategoryIds: TCategoryId[],
): Prisma.Sql => {
    const {
        offset,
        limit,
        search_string,
        company_id,
        category_id,
        sort_mode,
        min_price,
        max_price,
    } = input;
    const searchString = parseQueryString(search_string);
    const orderBySearchVector = Prisma.sql`ts_rank_cd(p.search_vector || com.search_vector || cat.search_vector,to_tsquery('simple',${searchString}),1) DESC`;
    const orderCondition =
        sort_mode === 1
            ? Prisma.sql`p.inventory != 0 DESC, p.price ASC,${orderBySearchVector},p._count DESC, p.id ASC`
            : sort_mode === 2
              ? Prisma.sql`p.inventory != 0 DESC, p.price DESC,${orderBySearchVector},p._count DESC, p.id ASC`
              : Prisma.sql`p.inventory != 0 DESC,${orderBySearchVector}, p._count DESC,p.discount DESC, p.id ASC`;
    const searchCondition = getSearchCondition(searchString);
    const companyCondition = getCompanyCondition(company_id);
    const categoryCondition = getCategoryCondition(TCategoryIds, category_id);

    const minPriceCondition = min_price
        ? Prisma.sql`AND p.price >= ${min_price}`
        : Prisma.empty;

    const maxPriceCondition = max_price
        ? Prisma.sql`AND p.price <= ${max_price}`
        : Prisma.empty;

    return Prisma.sql`
        SELECT p.id,p.name,p.price,p.description,
            p.inventory,p.company_id,p.category_id,p.shipping_cost,
            p.discount,p.created_at,p.updated_at,pi.images
        FROM (${productsByOrderCount}) as p
        INNER JOIN (${imagesJSON}) as pi
        ON p.id = pi.product_id
        INNER JOIN public."Company" as com
        ON p.company_id = com.id
        INNER JOIN public."Category" as cat
        ON p.category_id = cat.id
        WHERE ${searchCondition}
            ${companyCondition}
            ${categoryCondition}
            ${minPriceCondition}
            ${maxPriceCondition}
        ORDER BY ${orderCondition}
        LIMIT ${limit} OFFSET ${offset}
    `;
};

export const featuredProductsQuery = (
    input: FeaturedProductsDto,
): Prisma.Sql => Prisma.sql`
    SELECT p.id,p.name,p.price,p.description,
            p.inventory,p.company_id,p.category_id,p.shipping_cost,
            p.discount,p.created_at,p.updated_at,pi.images
    FROM public."Product" as p
    INNER JOIN (${imagesJSON}) as pi
    ON p.id = pi.product_id
    ORDER BY p.inventory != 0 DESC, p.discount DESC, p.id ASC
    LIMIT ${input.limit} OFFSET ${input.offset}
`;

export const relatedProductsQuery = (
    input: RelatedProductsDto,
): Prisma.Sql => Prisma.sql`
    SELECT po.id,po.name,po.price,po.description,
        po.inventory,po.company_id,po.category_id,po.shipping_cost,
        po.discount,po.created_at,po.updated_at,pi.images
    FROM (${productsByOrderCount}) as po
    INNER JOIN (${imagesJSON}) as pi
    ON po.id = pi.product_id
    WHERE NOT po.id = ${input.id} AND (po.company_id = ${input.company_id} OR po.category_id = ${input.category_id})
    ORDER BY po.inventory != 0 DESC, 
    CASE WHEN po.company_id = ${input.company_id} THEN 1 ELSE 2 END ASC,
    po._count DESC, po.id ASC
    LIMIT ${input.limit} OFFSET ${input.offset}
`;

export const popularProductsQuery = (
    input: PopularProductsDto,
): Prisma.Sql => Prisma.sql`
    SELECT po.id,po.name,po.price,po.description,
        po.inventory,po.company_id,po.category_id,po.shipping_cost,
        po.discount,po.created_at,po.updated_at,pi.images
    FROM (${productsByOrderCount}) as po
    INNER JOIN (${imagesJSON}) as pi
    ON po.id = pi.product_id
    ORDER BY po.inventory != 0 DESC, po._count DESC,po.id ASC
    LIMIT ${input.limit} OFFSET ${input.offset}
`;

export const searchBarDataQuery = (input: string): Prisma.Sql => {
    const searchString = parseQueryString(input);

    return Prisma.sql`
            (SELECT cat.id,cat.name,'Category' as source
            FROM public."Category" as cat
            WHERE cat.search_vector @@ to_tsquery('simple',${searchString})
            ORDER BY ts_rank_cd(cat.search_vector,to_tsquery('simple',${searchString})) DESC,cat.id
            LIMIT 3)
        UNION ALL
            (SELECT com.id,com.name,'Company' as source
            FROM public."Company" as com
            WHERE com.search_vector @@ to_tsquery('simple',${searchString})
            ORDER BY ts_rank_cd(com.search_vector,to_tsquery('simple',${searchString})) DESC,com.id
            LIMIT 3)
        UNION ALL
            (SELECT p.id,p.name,'Product' as source
            FROM public."Product" as p
            INNER JOIN
                (${productsByOrderCount}) as po
            ON p.id = po.id
            WHERE p.search_vector @@ to_tsquery('simple',${searchString})
            ORDER BY po.inventory != 0 DESC,ts_rank_cd(p.search_vector,to_tsquery('simple',${searchString})) DESC,
                po._count DESC,po.id ASC)
        LIMIT ${10}
    `;
};

export const updateProductCategoryQuery = (
    input: CreateProductDto,
): Prisma.Sql => Prisma.sql`
    INSERT INTO public."_CategoryToCompany" ("A","B")
    VALUES (${input.category_id},${input.company_id})
    ON CONFLICT DO NOTHING
`;

export const getImagesQuery = (id: TProductId): Prisma.Sql => Prisma.sql`
    SELECT * FROM public."ProductImage"
    WHERE product_id = ${id}
`;

export const deleteImagesQuery = (id: TProductId): Prisma.Sql => Prisma.sql`
    DELETE FROM public."ProductImage"
    WHERE product_id = ${id}
`;

export const deleteProductQuery = (id: TProductId): Prisma.Sql => Prisma.sql`
    DELETE FROM public."Product"
    WHERE id = ${id}
`;
