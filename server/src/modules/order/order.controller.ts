import {
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Req,
    UseGuards,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { TOrderId } from "./order.types";
import { Request } from "express";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { OrderWithItemsDto } from "./dto/get-orders.dto";

@ApiTags("order")
@Controller("order")
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get()
    @ApiOperation({ summary: "Retrieves user's orders" })
    @ApiCookieAuth()
    @UseGuards(AuthenticatedGuard)
    getOrders(@Req() req: Request): Promise<OrderWithItemsDto[]> {
        const userId = req.user!.id;
        return this.orderService.getOrders(userId);
    }
    @Patch(":id")
    @HttpCode(204)
    @ApiOperation({ summary: "Cancels specific order" })
    @ApiCookieAuth()
    @UseGuards(AuthenticatedGuard)
    cancelOrder(@Param("id") id: TOrderId, @Req() req: Request): void {
        const userId = req.user!.id;
        this.orderService.cancelOrder(id, userId);
    }
    @Delete(":id")
    @HttpCode(204)
    @ApiOperation({ summary: "Deletes specific order" })
    @ApiCookieAuth()
    @UseGuards(AuthenticatedGuard)
    deleteOrder(@Param("id") id: TOrderId, @Req() req: Request): void {
        const userId = req.user!.id;
        this.orderService.deleteOrder(id, userId);
    }
}
