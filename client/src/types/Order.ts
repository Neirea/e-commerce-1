import type { TProduct } from "./Product";

export type TOrderStatus =
    | "PENDING"
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
    delivery_address: string;
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

export type TOrderItem = TSingleOrderItem & { product: TProduct };

export type TOrderWithItems = TOrder & { order_items: TOrderItem[] };
