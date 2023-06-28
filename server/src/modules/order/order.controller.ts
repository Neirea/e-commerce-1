import { Body, Controller, Delete, Get, Patch } from "@nestjs/common";
import { OrderService } from "./order.service";
import { RemoveOrderDto } from "./dto/remove-order.dto";

@Controller("order")
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    // @Get()
    // testQueue() {
    //     return this.orderService.addOrderToQueue(13376);
    // }

    @Get()
    getOrders() {
        return this.orderService.getOrders();
    }

    @Patch()
    cancelOrder(@Body() body: RemoveOrderDto) {
        return this.orderService.cancelOrder(body);
    }
    @Delete()
    deleteOrder(@Body() body: RemoveOrderDto) {
        return this.orderService.deleteOrder(body);
    }
}
