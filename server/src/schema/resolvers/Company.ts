import { PrismaClient, Role } from "@prisma/client";
import { AuthenticationError, UserInputError } from "apollo-server-express";
import { Request } from "express";
import {
	CreateCompanyInput,
	UpdateCompanyInput,
} from "../../generated/graphql";

const prisma = new PrismaClient({ log: ["query"] });

const companyResolvers = {
	Query: {
		companies: (parent: any, args: unknown, { req }: { req: Request }) => {
			return prisma.company.findMany({ include: { categories: true } });
			// return prisma.$queryRaw`SELECT * FROM public."Company";`;
		},
	},
	Mutation: {
		createCompany: (
			parent: any,
			{ input }: { input: CreateCompanyInput },
			{ req }: { req: Request }
		) => {
			if (!req.session.user?.role.includes(Role.ADMIN)) {
				throw new AuthenticationError(
					"You don't have permissions for this action"
				);
			}
			if (input.name.length < 3) throw new UserInputError("Name is too short");
			return prisma.company.create({ data: input });
		},
		updateCompany: (
			parent: any,
			{ input }: { input: UpdateCompanyInput },
			{ req }: { req: Request }
		) => {
			if (!req.session.user?.role.includes(Role.ADMIN)) {
				throw new AuthenticationError(
					"You don't have permissions for this action"
				);
			}
			const { id, name } = input;
			return prisma.company.update({
				where: { id: id },
				data: { name },
			});
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
			await prisma.company.delete({ where: { id: id } });
			return true;
		},
	},
};

export default companyResolvers;
