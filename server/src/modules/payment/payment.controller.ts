import {
    Body,
    Controller,
    Param,
    Post,
    RawBodyRequest,
    Req,
    Headers,
} from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { Request } from "express";
import { CheckoutBodyDto } from "./dto/checkout-body.dto";
import { OrderId } from "../order/order.types";
import { ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CheckoutResponseDto } from "./dto/checkout-response.dto";

@ApiTags("payment")
@Controller("payment")
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Post("checkout")
    @ApiCookieAuth()
    checkoutPayment(
        @Req() req: Request,
        @Body() body: CheckoutBodyDto,
    ): Promise<CheckoutResponseDto> {
        const user = req.user;
        return this.paymentService.initializePayment(user, body);
    }

    @Post("checkout/:id")
    @ApiOperation({ description: "Proceeding unfinished order" })
    @ApiCookieAuth()
    finishPayment(
        @Param("id") id: OrderId,
        @Req() req: Request,
    ): Promise<CheckoutResponseDto> {
        const user = req.user;
        return this.paymentService.resumePayment(user, id);
    }

    @Post("webhook")
    @ApiOperation({ description: "Receiving stripe events" })
    @ApiCookieAuth()
    stripeWebhook(
        @Req() req: RawBodyRequest<Request>,
        @Headers("stripe-signature") signature: string,
    ): Promise<{
        received: string;
    }> {
        const rawBody = req.rawBody;
        return this.paymentService.stripeWebhook(signature, rawBody);
    }
}
