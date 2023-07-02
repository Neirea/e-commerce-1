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
import { OrderId, OrderWithItems } from "./order.types";
import { Request } from "express";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";

@Controller("order")
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get()
    @UseGuards(AuthenticatedGuard)
    getOrders(@Req() req: Request): Promise<OrderWithItems[]> {
        const user = req.user;
        return this.orderService.getOrders(user);
    }

    @Patch(":id")
    @UseGuards(AuthenticatedGuard)
    cancelOrder(@Param("id") id: OrderId): Promise<void> {
        return this.orderService.cancelOrder(id);
    }
    @Delete(":id")
    @UseGuards(AuthenticatedGuard)
    deleteOrder(@Param("id") id: OrderId): Promise<void> {
        return this.orderService.deleteOrder(id);
    }
}
