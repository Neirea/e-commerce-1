import { Order, Product, ProductImage, SingleOrderItem } from "@prisma/client";

export type TOrderId = Pick<Order, "id">["id"];

export type TOrderItemWithImages = SingleOrderItem & {
    product: Product;
    images: ProductImage[];
};

export type TOrderWithItemsAndImgs = Order & {
    order_items: TOrderItemWithImages[];
};
