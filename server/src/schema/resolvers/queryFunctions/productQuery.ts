import { Prisma, Product } from "@prisma/client";
import prisma from "../../../prisma";
import { imagesJSON } from "../sql/Product";

export default async (parent: any, { id }: { id: number }) => {
    const variantsJSON = Prisma.sql`
        SELECT p.id,json_agg(json_build_object('id',vrn.id,'name',p.name,'images',vrn.images)) as variants
        FROM public."Product" as p
        INNER JOIN
            (SELECT DISTINCT v."A" as prod_id, v."B" as id,i.images 
            FROM public."_variants" as v
            INNER JOIN (${imagesJSON}) as i
            ON v."B" = i.product_id) as vrn
        ON p.id = vrn.prod_id
        WHERE p.id = ${id}
        GROUP BY p.id
    `;
    const product = await prisma.$queryRaw<[Product]>`
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
    return product[0];
};
