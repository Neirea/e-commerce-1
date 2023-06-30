export type IOrderStatus =
    | "PENDING"
    | "ACCEPTED"
    | "PROCESSING"
    | "DELIVERED"
    | "CANCELLED";

export type IOrder = {
    id: number;
    status: IOrderStatus;
    shipping_cost: number;
    user_id: number;
    buyer_name: string;
    buyer_email: string;
    buyer_phone: string;
    delivery_address: string;
    created_at: Date;
    payment_time: Date;
};

export type ISingleOrderItem = {
    id: number;
    order_id: number;
    amount: number;
    price: number;
    product_id: number;
};

export type IOrderWithItems = IOrder & { order_items: ISingleOrderItem[] };
