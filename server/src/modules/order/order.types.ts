import { Order, Product, ProductImage, SingleOrderItem } from "@prisma/client";

export type OrderId = Pick<Order, "id">["id"];

export type OrderItem = SingleOrderItem & { product: Product };

export type OrderWithItems = Order & { order_items: OrderItem[] };

export type OrderItemWithImages = SingleOrderItem & {
    product: Product;
    images: ProductImage[];
};

export type OrderWithItemsAndImgs = Order & {
    order_items: OrderItemWithImages[];
};
