import {
    Body,
    Controller,
    Headers,
    HttpCode,
    Post,
    RawBodyRequest,
    Req,
} from "@nestjs/common";
import { ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { CheckoutBodyDto } from "./dto/checkout-body.dto";
import { CheckoutResponseDto } from "./dto/checkout-response.dto";
import { PaymentService } from "./payment.service";

@ApiTags("payment")
@Controller("payment")
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Post("checkout")
    @ApiOperation({ summary: "Proceeds fresh order" })
    @ApiCookieAuth()
    checkoutPayment(
        @Req() req: Request,
        @Body() body: CheckoutBodyDto,
    ): Promise<CheckoutResponseDto> {
        const user = req.user;
        return this.paymentService.initializePayment(user, body);
    }

    @Post("webhook")
    @HttpCode(200)
    @ApiOperation({ summary: "Receives stripe events" })
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
