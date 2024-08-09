import { SingleOrderItem } from "@prisma/client";
import { TOrderId } from "../order.types";
import { TProductId } from "src/modules/product/product.types";

export class OrderItem implements SingleOrderItem {
    id: Pick<SingleOrderItem, "id">["id"];
    order_id: TOrderId;
    amount: Pick<SingleOrderItem, "amount">["amount"];
    price: Pick<SingleOrderItem, "price">["price"];
    product_id: TProductId;
}
