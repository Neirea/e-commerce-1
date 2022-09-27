import { PrismaClient } from "@prisma/client";
import { Request } from "express";
import { AuthenticationError } from "apollo-server-express";
import { CreateOrderInput, Status } from "../../generated/graphql";
import { OrderStatus } from "@prisma/client";

const prisma = new PrismaClient({ log: ["query"] });

const orderResolvers = {
	Query: {
		orders: (parent: any, args: any, { req }: { req: Request }) => {
			if (req.session.user == null) {
				throw new AuthenticationError("You must login to access this route");
			}
			return prisma.order.findMany({
				where: { user_id: req.session.user?.id },
			});
		},
	},
	Mutation: {
		createOrder: async (
			parent: any,
			{ input }: { input: CreateOrderInput }
		) => {
			await prisma.order.create({ data: input });
			return true;
		},
		updateOrder: async (
			parent: any,
			{ id, status }: { id: number; status: Status }
		) => {
			await prisma.order.update({
				where: { id: id },
				data: { status: status as OrderStatus },
			});
			return true;
		},
		cancelOrder: async (parent: any, { id }: { id: number }) => {
			await prisma.order.update({
				where: { id: id },
				data: { status: Status.CANCELLED },
			});
			return true;
		},
		deleteOrder: async (parent: any, { id }: { id: number }) => {
			await prisma.order.delete({
				where: { id: id },
			});
			return true;
		},
	},
};

export default orderResolvers;
