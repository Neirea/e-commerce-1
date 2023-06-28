import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PaymentService {
    constructor(private prisma: PrismaService) {}

    // ADD CHECKOUT AND PAYMENT LOGIC
}
