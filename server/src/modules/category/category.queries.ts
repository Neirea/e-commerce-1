import { Prisma } from "src/database/generated/client";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { TCategoryId } from "./category.types";

// USE THIS WHEN COMPANIES WILL BE REQUIRED
// SELECT cat.id,cat.name,cat.img_id,cat.img_src,cat.parent_id,
// COALESCE(json_agg(json_build_object('id', com.id, 'name', com.name))
// FILTER (WHERE com.id IS NOT NULL),'[]') as companies
// FROM public."Category" as cat
// LEFT JOIN public."_CategoryToCompany" as catcom ON cat.id = catcom."A"
// LEFT JOIN public."Company" as com ON catcom."B" = com.id
// GROUP BY cat.id
export const getCategoriesQuery = Prisma.sql`
    SELECT cat.id,cat.name,cat.img_id,cat.img_src,cat.parent_id
    FROM public."Category" as cat
`;

export const createCategoryQuery = (
    input: CreateCategoryDto,
): Prisma.Sql => Prisma.sql`
    INSERT INTO public."Category"("name","img_id","img_src","parent_id")
    VALUES (${input.name},${input.img_id},${input.img_src},${input.parent_id})
`;

export const categoryByIdQuery = (id: TCategoryId): Prisma.Sql => Prisma.sql`
    SELECT * FROM public."Category"
    WHERE id = ${id}
`;

export const updateCategoryQuery = (
    id: TCategoryId,
    { img_id, img_src, parent_id, name }: UpdateCategoryDto,
): Prisma.Sql => {
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

export const deleteCategoryQuery = (id: TCategoryId): Prisma.Sql => Prisma.sql`
    DELETE FROM public."Category"
    WHERE id = ${id}
    RETURNING *
`;
