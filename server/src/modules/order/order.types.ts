import { Order, Product, ProductImage, SingleOrderItem } from "@prisma/client";

export type TOrderId = Pick<Order, "id">["id"];

export interface TOrderItemWithImages extends SingleOrderItem {
    product: Product;
    images: ProductImage[];
}

export interface TOrderWithItemsAndImgs extends Order {
    order_items: TOrderItemWithImages[];
}
