import { Test, TestingModule } from "@nestjs/testing";
import { PaymentService } from "./payment.service";
import { PrismaService } from "../prisma/prisma.service";

describe("PaymentService", () => {
    let service: PaymentService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PaymentService, PrismaService],
        }).compile();

        service = module.get<PaymentService>(PaymentService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
