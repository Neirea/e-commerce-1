import { Test, TestingModule } from "@nestjs/testing";
import { OrderService } from "./order.service";
import { PrismaService } from "../prisma/prisma.service";
import { getOrdersByUserQuery } from "./order.queries";

describe("OrderService", () => {
    let service: OrderService;
    let prismaServiceMock: Partial<PrismaService> & { $queryRaw: jest.Mock };

    beforeEach(async () => {
        prismaServiceMock = {
            $queryRaw: jest.fn(),
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrderService,
                {
                    provide: PrismaService,
                    useValue: prismaServiceMock,
                },
            ],
        }).compile();

        service = module.get<OrderService>(OrderService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("getOrders", () => {
        it("should return list of orders", async () => {
            const mockResult = [{ id: 1, name: "RAM" }];
            prismaServiceMock.$queryRaw.mockImplementation(() => mockResult);

            const result = await service.getOrders(2);

            expect(prismaServiceMock.$queryRaw).toHaveBeenCalledWith(
                getOrdersByUserQuery(2),
            );
            expect(result).toEqual(mockResult);
        });
    });
});
