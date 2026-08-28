import { Product } from "../../../modules/product/entities/product.entity.js";
import { OrderItem } from "../entities/order-item.entity.js";
import { Order } from "../entities/order.entity.js";

export class SingleOrderItem extends OrderItem {
    product: Product;
}

export class OrderWithItemsDto extends Order {
    order_items: SingleOrderItem[];
}
