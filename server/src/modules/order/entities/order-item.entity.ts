import { SingleOrderItem } from "@prisma/client";
import { OrderId } from "../order.types";
import { ProductId } from "src/modules/product/product.types";

export class OrderItem implements SingleOrderItem {
    id: Pick<SingleOrderItem, "id">["id"];
    order_id: OrderId;
    amount: Pick<SingleOrderItem, "amount">["amount"];
    price: Pick<SingleOrderItem, "price">["price"];
    product_id: ProductId;
}
