import { Order, Product, SingleOrderItem } from "@prisma/client";

export type OrderId = Pick<Order, "id">["id"];

export type OrderItem = SingleOrderItem & { product: Product };

export type OrderWithItems = Order & { order_items: OrderItem[] };
