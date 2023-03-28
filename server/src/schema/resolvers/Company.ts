import { Role } from "@prisma/client";
import { AuthenticationError, UserInputError } from "../errors";
import { Request } from "express";
import {
    CreateCompanyInput,
    UpdateCompanyInput,
} from "../../generated/graphql";
import prisma from "../../prisma";

const companyResolvers = {
    Query: {
        companies: () => {
            return prisma.$queryRaw`
                SELECT com.*,COALESCE(json_agg(cat.*) FILTER (WHERE cat.id IS NOT NULL),'[]') as categories
                FROM public."Company" as com
                LEFT JOIN public."_CategoryToCompany" as catcom ON com.id = catcom."B"
                LEFT JOIN public."Category" as cat ON catcom."A" = cat.id
                GROUP BY com.id
            `;
        },
    },
    Mutation: {
        createCompany: async (
            parent: any,
            { input }: { input: CreateCompanyInput },
            { req }: { req: Request }
        ) => {
            if (!req.session.user?.role.includes(Role.ADMIN)) {
                throw new AuthenticationError(
                    "You don't have permissions for this action"
                );
            }
            if (input.name.length < 3) {
                throw new UserInputError("Name is too short");
            }
            await prisma.$queryRaw`
                INSERT INTO public."Company"("name")
                VALUES (${input.name})
            `;

            return true;
        },
        updateCompany: async (
            parent: any,
            { input }: { input: UpdateCompanyInput },
            { req }: { req: Request }
        ) => {
            if (!req.session.user?.role.includes(Role.ADMIN)) {
                throw new AuthenticationError(
                    "You don't have permissions for this action"
                );
            }
            if (input.name.length < 3) {
                throw new UserInputError("Name is too short");
            }
            await prisma.$queryRaw`
                UPDATE public."Company"
                SET "name" = ${input.name}
                WHERE id = ${input.id}
            `;
            return true;
        },
        deleteCompany: async (
            parent: any,
            { id }: { id: number },
            { req }: { req: Request }
        ) => {
            if (!req.session.user?.role.includes(Role.ADMIN)) {
                throw new AuthenticationError(
                    "You don't have permissions for this action"
                );
            }
            await prisma.$queryRaw`
                DELETE FROM public."Company"
                WHERE id = ${id}
            `;
            return true;
        },
    },
};

export default companyResolvers;
