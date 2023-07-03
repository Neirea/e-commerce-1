import { Order, Product, ProductImage, SingleOrderItem } from "@prisma/client";

export type OrderId = Pick<Order, "id">["id"];

export type OrderItemWithImages = SingleOrderItem & {
    product: Product;
    images: ProductImage[];
};

export type OrderWithItemsAndImgs = Order & {
    order_items: OrderItemWithImages[];
};
