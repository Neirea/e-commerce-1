import { Prisma } from "@prisma/client";
import { RemoveOrderDto } from "./dto/remove-order.dto";

export const getOrdersQuery = (userId: number) => Prisma.sql`
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

export const cancelOrderQuery = (input: RemoveOrderDto) => Prisma.sql`
    UPDATE public."Order"
    SET "status" = 'CANCELLED'
    WHERE id = ${input.id} AND "status" = 'PENDING'
`;

export const deleteOrderQuery = (input: RemoveOrderDto) => Prisma.sql`
    DELETE FROM public."Order"
    WHERE id = ${input.id}
`;
