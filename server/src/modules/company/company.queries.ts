import { Prisma } from "@prisma/client";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { TCompanyId } from "./company.types";

export const getCompaniesQuery = Prisma.sql`
    SELECT com.*,COALESCE(json_agg(cat.*) FILTER (WHERE cat.id IS NOT NULL),'[]') as categories
    FROM public."Company" as com
    LEFT JOIN public."_CategoryToCompany" as catcom ON com.id = catcom."B"
    LEFT JOIN public."Category" as cat ON catcom."A" = cat.id
    GROUP BY com.id
`;

export const createCompanyQuery = (
    input: CreateCompanyDto,
): Prisma.Sql => Prisma.sql`
    INSERT INTO public."Company"("name")
    VALUES (${input.name})
`;

export const updateCompanyQuery = (
    id: TCompanyId,
    input: UpdateCompanyDto,
): Prisma.Sql => Prisma.sql`
    UPDATE public."Company"
    SET "name" = ${input.name}
    WHERE id = ${id}
`;

export const deleteCompanyQuery = (id: TCompanyId): Prisma.Sql => Prisma.sql`
    DELETE FROM public."Company"
    WHERE id = ${id}
`;
