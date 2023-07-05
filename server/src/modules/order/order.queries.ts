import { Prisma, SingleOrderItem } from "@prisma/client";
import { OrderId } from "./order.types";
import { UserId } from "../user/user.types";
import { imagesJSON } from "../product/utils/sql";

export const getOrdersByUserQuery = (userId: UserId): Prisma.Sql => Prisma.sql`
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

export const cancelOrderQuery = (
    id: OrderId,
    userId: UserId,
): Prisma.Sql => Prisma.sql`
    UPDATE public."Order"
    SET "status" = 'CANCELLED'
    WHERE id = ${id} AND "status" = 'PENDING' AND user_id = ${userId}
`;

export const deleteOrderQuery = (
    id: OrderId,
    userId: UserId,
): Prisma.Sql => Prisma.sql`
    DELETE FROM public."Order"
    WHERE id = ${id} AND user_id = ${userId}
`;

export const getOrdersByOrderIdQuery = (
    orderId: OrderId,
): Prisma.Sql => Prisma.sql`
    SELECT o.*,json_agg(s.*) as order_items
    FROM public."Order" as o
    INNER JOIN
        (SELECT s.id,s.amount,s.order_id,to_json(p.*) as product,i.images
        FROM public."SingleOrderItem" as s
        INNER JOIN (${imagesJSON}) as i ON s.product_id = i.product_id
        INNER JOIN public."Product" as p
        ON s.product_id = p.id) as s
    ON s.order_id = o.id
    WHERE o.id = ${orderId}
    GROUP BY o.id
`;

export const updateOrderItemQuery = (
    order: SingleOrderItem,
): Prisma.Sql => Prisma.sql`
    UPDATE public."Product"
    SET inventory = inventory - ${order.amount}
    WHERE id = ${order.product_id}
`;

export const deletePendingOrdersQuery = Prisma.sql`
    DELETE FROM public."Order" as o
    WHERE o.status = 'PENDING'
    AND o.created_at < NOW() - INTERVAL '1 day'
`;
