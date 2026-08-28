import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../prisma/prisma.service.js";
import { getOrdersByUserQuery } from "./order.queries.js";
import { OrderService } from "./order.service.js";
import { vi } from "vitest";
import { TPrismaServiceMock } from "../../utils/types.mock.js";

describe("OrderService", () => {
    let service: OrderService;
    let prismaService: TPrismaServiceMock;

    beforeEach(async () => {
        const prismaMock = {
            $queryRaw: vi.fn(),
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrderService,
                {
                    provide: PrismaService,
                    useValue: prismaMock,
                },
            ],
        }).compile();

        service = module.get<OrderService>(OrderService);
        prismaService = module.get<TPrismaServiceMock>(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("getOrders", () => {
        it("should return list of orders", async () => {
            const mockResult = [{ id: 1, name: "RAM" }];
            prismaService.$queryRaw.mockResolvedValue(mockResult);

            const result = await service.getOrders(2);

            expect(prismaService.$queryRaw).toHaveBeenCalledWith(
                getOrdersByUserQuery(2),
            );
            expect(result).toEqual(mockResult);
        });
    });
});
