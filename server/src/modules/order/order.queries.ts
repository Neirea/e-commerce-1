import { Prisma } from "@prisma/client";
import { OrderId } from "./order.types";
import { UserId } from "../user/user.types";

export const getOrdersQuery = (userId: UserId) => Prisma.sql`
    SELECT o.*,json_agg(sp.*) as order_items
    FROM public."Order" as o
    INNER JOIN
        (SELECT so.*,to_json(p.*) as product
        FROM public."SingleOrderItem" as so
        INNER JOIN public."Product" as p ON so.product_id = p.id) as sp
    ON o.id = sp.order_id
    WHERE o.user_id = ${userId}
    GROUP BY o.id
`;

export const cancelOrderQuery = (id: OrderId) => Prisma.sql`
    UPDATE public."Order"
    SET "status" = 'CANCELLED'
    WHERE id = ${id} AND "status" = 'PENDING'
`;

export const deleteOrderQuery = (id: OrderId) => Prisma.sql`
    DELETE FROM public."Order"
    WHERE id = ${id}
`;
