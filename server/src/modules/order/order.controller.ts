import {
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Req,
    UseGuards,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderId } from "./order.types";
import { Request } from "express";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";

@Controller("order")
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get()
    @UseGuards(AuthenticatedGuard)
    getOrders(@Req() req: Request) {
        return this.orderService.getOrders(req);
    }

    @Patch(":id")
    @UseGuards(AuthenticatedGuard)
    cancelOrder(@Param("id") id: OrderId) {
        return this.orderService.cancelOrder(id);
    }
    @Delete(":id")
    @UseGuards(AuthenticatedGuard)
    deleteOrder(@Param("id") id: OrderId) {
        return this.orderService.deleteOrder(id);
    }
}
