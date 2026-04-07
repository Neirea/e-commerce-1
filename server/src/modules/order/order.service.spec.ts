import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../prisma/prisma.service";
import { getOrdersByUserQuery } from "./order.queries";
import { OrderService } from "./order.service";

describe("OrderService", () => {
    let service: OrderService;
    let prismaServiceMock: Partial<PrismaService> & {
        $queryRaw: jest.MockedFunction<PrismaService["$queryRaw"]>;
    };

    beforeEach(async () => {
        prismaServiceMock = {
            $queryRaw: jest.fn() as jest.MockedFunction<
                PrismaService["$queryRaw"]
            >,
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
            prismaServiceMock.$queryRaw.mockResolvedValue(mockResult);

            const result = await service.getOrders(2);

            expect(prismaServiceMock.$queryRaw).toHaveBeenCalledWith(
                getOrdersByUserQuery(2),
            );
            expect(result).toEqual(mockResult);
        });
    });
});
