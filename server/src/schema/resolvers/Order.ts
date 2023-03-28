import { AuthenticationError } from "../errors";
import { Request } from "express";
import prisma from "../../prisma";

const orderResolvers = {
    Query: {
        orders: (parent: any, args: any, { req }: { req: Request }) => {
            if (req.session.user == null) {
                throw new AuthenticationError(
                    "You must login to access this route"
                );
            }
            return prisma.$queryRaw`
                SELECT o.*,json_agg(sp.*) as order_items
                FROM public."Order" as o
                INNER JOIN
                    (SELECT so.*,to_json(p.*) as product
                    FROM public."SingleOrderItem" as so
                    INNER JOIN public."Product" as p ON so.product_id = p.id) as sp
                ON o.id = sp.order_id
                WHERE o.user_id = ${req.session.user.id}
                GROUP BY o.id
            `;
        },
    },
    Mutation: {
        cancelOrder: async (parent: any, { id }: { id: number }) => {
            await prisma.$queryRaw`
                UPDATE public."Order"
                SET "status" = 'CANCELLED'
                WHERE id = ${id} AND "status" = 'PENDING'
            `;
            return true;
        },
        deleteOrder: async (parent: any, { id }: { id: number }) => {
            await prisma.$queryRaw`
                DELETE FROM public."Order"
                WHERE id = ${id}
            `;
            return true;
        },
    },
};

export default orderResolvers;
