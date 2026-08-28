import {
    OrderStatus,
    Order as TOrder,
} from "../../../database/generated/client.js";
import { TOrderId } from "../order.types.js";
import {
    TUserAddress,
    TUserEmail,
    TUserGivenName,
    TUserId,
} from "../../../modules/user/user.types.js";
import { TProductShippingCost } from "../../../modules/product/product.types.js";
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
