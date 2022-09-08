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
			return prisma.company.create({ data: input });
		},
		updateCompany: (parent: any, { input }: { input: UpdateCompanyInput }) => {
			const { id, name } = input;
			return prisma.company.update({
				where: { id: id },
				data: { name },
			});
		},
		deleteCompany: async (parent: any, { id }: { id: number }) => {
			const data = await prisma.company.delete({ where: { id: id } });
			if (data) return true;
			return false;
		},
	},
};

export default companyResolvers;
