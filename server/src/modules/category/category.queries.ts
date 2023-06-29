import { Prisma } from "@prisma/client";
import { createCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CateogoryId } from "./category.types";

export const categoriesQuery = Prisma.sql`
    SELECT cat.*,COALESCE(json_agg(com.*) FILTER (WHERE com.id IS NOT NULL),'[]') as companies
    FROM public."Category" as cat
    LEFT JOIN public."_CategoryToCompany" as catcom ON cat.id = catcom."A"
    LEFT JOIN public."Company" as com ON catcom."B" = com.id
    GROUP BY cat.id
`;

export const createCategoryQuery = (input: createCategoryDto) => Prisma.sql`
    INSERT INTO public."Category"("name","img_id","img_src","parent_id")
    VALUES (${input.name},${input.img_id},${input.img_src},${input.parent_id})
`;

export const categoryByIdQuery = (id: CateogoryId) => Prisma.sql`
    SELECT * FROM public."Category"
    WHERE id = ${id}
`;

export const updateCategoryQuery = (
    id: CateogoryId,
    { img_id, img_src, parent_id }: UpdateCategoryDto,
) => {
    const imgSQL = img_id
        ? Prisma.sql`,img_id = ${img_id},img_src=${img_src}`
        : Prisma.empty;

    return Prisma.sql`
        UPDATE public."Category"
        SET parent_id = ${parent_id},
            "name" = ${name}
            ${imgSQL}
        WHERE id = ${id}
    `;
};

export const deleteCategoryQuery = (id: CateogoryId) => Prisma.sql`
    DELETE FROM public."Category"
    WHERE id = ${id}
    RETURNING *
`;
