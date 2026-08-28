import { SingleOrderItem } from "../../../database/generated/client.js";
import { TOrderId } from "../order.types.js";
import { TProductId } from "../../../modules/product/product.types.js";

export class OrderItem implements SingleOrderItem {
    id: Pick<SingleOrderItem, "id">["id"];
    order_id: TOrderId;
    amount: Pick<SingleOrderItem, "amount">["amount"];
    price: Pick<SingleOrderItem, "price">["price"];
    product_id: TProductId;
}
