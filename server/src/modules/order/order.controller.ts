import { Controller, Delete, Get, Param, Patch, Req } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderId } from "./order.types";
import { Request } from "express";

@Controller("order")
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get()
    getOrders(@Req() req: Request) {
        return this.orderService.getOrders(req);
    }

    @Patch(":id")
    cancelOrder(@Param("id") id: OrderId) {
        return this.orderService.cancelOrder(id);
    }
    @Delete(":id")
    deleteOrder(@Param("id") id: OrderId) {
        return this.orderService.deleteOrder(id);
    }
}
