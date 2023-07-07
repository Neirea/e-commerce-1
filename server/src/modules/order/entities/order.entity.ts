import { OrderStatus, Order as IOrder } from "@prisma/client";
import { OrderId } from "../order.types";
import {
    UserAddress,
    UserEmail,
    UserGivenName,
    UserId,
} from "src/modules/user/user.types";
import { ProductShippingCost } from "src/modules/product/product.types";
import { ApiProperty } from "@nestjs/swagger";

export class Order implements IOrder {
    id: OrderId;
    @ApiProperty({
        enum: [
            '"PENDING", "ACCEPTED", "PROCESSING" , "DELIVERED" , "CANCELLED"',
        ],
    })
    status: OrderStatus;
    shipping_cost: ProductShippingCost;
    user_id: UserId;
    buyer_name: UserGivenName;
    buyer_email: UserEmail;
    buyer_phone: string;
    delivery_address: UserAddress;
    created_at: Date;
    payment_time: Date;
}
