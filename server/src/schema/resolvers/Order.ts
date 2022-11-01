import { PrismaClient } from "@prisma/client";
import { AuthenticationError } from "apollo-server-express";
import { Request } from "express";
import { Status } from "../../generated/graphql";

const prisma = new PrismaClient();

const orderResolvers = {
    Query: {
        orders: (parent: any, args: any, { req }: { req: Request }) => {
            if (req.session.user == null) {
                throw new AuthenticationError(
                    "You must login to access this route"
                );
            }
            return prisma.order.findMany({
                where: { user_id: req.session.user?.id },
                include: {
                    order_items: {
                        select: {
                            product: true,
                            amount: true,
                            price: true,
                        },
                    },
                },
            });
        },
    },
    Mutation: {
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
