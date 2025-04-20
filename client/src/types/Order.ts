import type { TProduct } from "./Product";
import type { TAddress } from "./User";

export type TOrderStatus =
    | "ACCEPTED"
    | "PROCESSING"
    | "DELIVERED"
    | "CANCELLED";

export type TOrder = {
    id: number;
    status: TOrderStatus;
    shipping_cost: number;
    user_id: number;
    buyer_name: string;
    buyer_email: string;
    buyer_phone: string;
    delivery_address: TAddress;
    created_at: string;
    payment_time: string;
};

export type TSingleOrderItem = {
    id: number;
    order_id: number;
    amount: number;
    price: number;
    product_id: number;
};

export interface TOrderItem extends TSingleOrderItem {
    product: TProduct;
}

export interface TOrderWithItems extends TOrder {
    order_items: TOrderItem[];
}
