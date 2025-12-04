import { OrderStatus, Order as TOrder } from "src/database/generated/client";
import { TOrderId } from "../order.types";
import {
    TUserAddress,
    TUserEmail,
    TUserGivenName,
    TUserId,
} from "src/modules/user/user.types";
import { TProductShippingCost } from "src/modules/product/product.types";
import { ApiProperty } from "@nestjs/swagger";

export class Order implements TOrder {
    id: TOrderId;
    @ApiProperty({
        enum: [
            '"PENDING", "ACCEPTED", "PROCESSING" , "DELIVERED" , "CANCELLED"',
        ],
    })
    status: OrderStatus;
    shipping_cost: TProductShippingCost;
    user_id: TUserId;
    buyer_name: TUserGivenName;
    buyer_email: TUserEmail;
    buyer_phone: string;
    delivery_address: TUserAddress;
    created_at: Date;
    payment_time: Date;
}
