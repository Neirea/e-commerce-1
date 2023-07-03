import { Product } from "src/modules/product/entities/product.entity";
import { OrderItem } from "../entities/order-item.entity";
import { Order } from "../entities/order.entity";

export class SingleOrderItem extends OrderItem {
    product: Product;
}

export class OrderWithItemsDto extends Order {
    order_items: SingleOrderItem[];
}
