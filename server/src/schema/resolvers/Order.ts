import { GraphQLScalarType, Kind } from "graphql";
import { PrismaClient } from "@prisma/client";
import GraphQLJSON from "graphql-type-json";

const prisma = new PrismaClient({ log: ["query"] });

const orderResolvers = {
	Query: {
		orders: (parent: any, args: any) => {
			const orders = prisma.$queryRaw`SELECT * FROM public."Order";`;
			console.log("orders=", orders);

			return orders;
			//add error handling
			if (orders) return { orders: orders };
			return { message: "There was an Error" };
		},
	},
	Mutation: {
		createOrder: (parent: any, args: any) => {
			const order = args.input;

			return prisma.order.create({ data: order });
		},
		updateOrder: (parent: any, args: any) => {
			const order_id = args.input.id;
			return prisma.review.update({
				where: { id: order_id },
				data: { ...args.input }, // probably wrong #any
			});
		},
		deleteOrder: (parent: any, args: any) => {
			return prisma.order.delete({ where: { id: args.id } });
		},
	},
};

export default orderResolvers;
