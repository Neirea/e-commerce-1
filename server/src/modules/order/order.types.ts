import { Order, SingleOrderItem } from "@prisma/client";

export type OrderId = Pick<Order, "id">["id"];

export type OrderWithItems = Order & { order_items: SingleOrderItem[] };
