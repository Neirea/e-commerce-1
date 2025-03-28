import { Prisma, SingleOrderItem } from "@prisma/client";
import { TUserId } from "../user/user.types";
import { TOrderId } from "./order.types";

export const getOrdersByUserQuery = (
    TUserId: TUserId,
): Prisma.Sql => Prisma.sql`
    SELECT o.*,json_agg(sp.*) as order_items
    FROM public."Order" as o
    INNER JOIN
        (SELECT so.*,json_build_object(
            'id',p.id,
            'name',p.name,
            'price',p.price,
            'description',p.description,
            'inventory',p.inventory,
            'company_id',p.company_id,
            'category_id',p.category_id,
            'shipping_cost',p.shipping_cost,
            'discount',p.discount,
            'created_at',p.created_at,
            'updated_at',p.updated_at) as product
        FROM public."SingleOrderItem" as so
        INNER JOIN public."Product" as p ON so.product_id = p.id) as sp
    ON o.id = sp.order_id
    WHERE o.user_id = ${TUserId}
    GROUP BY o.id
`;

export const cancelOrderQuery = (
    id: TOrderId,
    TUserId: TUserId,
): Prisma.Sql => Prisma.sql`
    UPDATE public."Order"
    SET "status" = 'CANCELLED'
    WHERE id = ${id} AND "status" = 'PENDING' AND user_id = ${TUserId}
`;

export const deleteOrderQuery = (
    id: TOrderId,
    TUserId: TUserId,
): Prisma.Sql => Prisma.sql`
    DELETE FROM public."Order"
    WHERE id = ${id} AND user_id = ${TUserId}
`;
export const updateOrderItemQuery = (
    order: SingleOrderItem,
): Prisma.Sql => Prisma.sql`
    UPDATE public."Product"
    SET inventory = inventory - ${order.amount}
    WHERE id = ${order.product_id}
`;
