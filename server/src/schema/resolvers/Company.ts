import { PrismaClient } from "@prisma/client";
import {
	CreateCompanyInput,
	UpdateCompanyInput,
} from "../../generated/graphql";

const prisma = new PrismaClient({ log: ["query"] });

const companyResolvers = {
	Query: {
		companies: () => {
			return prisma.$queryRaw`SELECT * FROM public."Company";`;
		},
	},
	Mutation: {
		createCompany: (parent: any, { input }: { input: CreateCompanyInput }) => {
			return prisma.category.update({
				where: { id: input.category_id },
				data: {
					companies: { create: { name: input.name } },
				},
			});
		},
		updateCompany: (parent: any, { input }: { input: UpdateCompanyInput }) => {
			const { id, name } = input;
			return prisma.company.update({
				where: { id: id },
				data: { name },
			});
		},
		deleteCompany: (parent: any, { id }: { id: number }) => {
			prisma.company.delete({ where: { id: id } });

			return true;
		},
	},
};

export default companyResolvers;
