import { Test, TestingModule } from "@nestjs/testing";
import { PaymentService } from "./payment.service";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";
import { BadRequestException } from "@nestjs/common";
import { getProductsByIdsQuery } from "../product/product.queries";
import { getOrdersByOrderIdQuery } from "../order/order.queries";

const createCheckoutSessionMock = jest.fn();
const constructEventMock = jest.fn();

type prismaServiceMockType = Partial<PrismaService> & {
    $queryRaw: jest.Mock;
    $transaction: jest.Mock;
    order: {
        create: jest.Mock;
        update: jest.Mock;
    };
};

jest.mock("stripe", () => {
    return {
        Stripe: jest.fn().mockImplementation(() => ({ hello: "world" })),
        default: jest.fn().mockImplementation(() => {
            return {
                checkout: {
                    sessions: {
                        create: createCheckoutSessionMock,
                    },
                },
                webhooks: {
                    constructEvent: constructEventMock,
                },
            };
        }),
    };
});

describe("PaymentService", () => {
    let service: PaymentService;
    let prismaServiceMock: prismaServiceMockType;

    beforeEach(async () => {
        prismaServiceMock = {
            $queryRaw: jest.fn(),
            $transaction: jest.fn(),
            order: {
                create: jest.fn(),
                update: jest.fn(),
            },
        } as prismaServiceMockType;
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentService,
                {
                    provide: PrismaService,
                    useValue: prismaServiceMock,
                },
            ],
        }).compile();

        service = module.get<PaymentService>(PaymentService);
    });

    afterEach(() => {
        constructEventMock.mockClear();
        createCheckoutSessionMock.mockClear();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("initializePayment", () => {
        it("should throw BadRequestException if cart is empty", async () => {
            const user = {} as User;
            const body = {
                items: [],
                buyer: {
                    name: "John Doe",
                    email: "john@example.com",
                    address: "123 Street",
                    phone: "",
                },
            };

            await expect(service.initializePayment(user, body)).rejects.toThrow(
                BadRequestException,
            );
            expect(prismaServiceMock.$queryRaw).not.toBeCalled();
            expect(prismaServiceMock.order.create).not.toBeCalled();
            expect(prismaServiceMock.order.update).not.toBeCalled();
        });

        it("should throw BadRequestException if cart has invalid item", async () => {
            const user = {} as User;
            const body = {
                items: [{ id: 1, amount: 0 }],
                buyer: {
                    name: "John Doe",
                    email: "john@example.com",
                    address: "123 Street",
                    phone: "",
                },
            };

            await expect(service.initializePayment(user, body)).rejects.toThrow(
                BadRequestException,
            );
            expect(prismaServiceMock.$queryRaw).not.toBeCalled();
            expect(prismaServiceMock.order.create).not.toBeCalled();
            expect(prismaServiceMock.order.update).not.toBeCalled();
        });

        it("should create an order and return a CheckoutResponseDto with session URL", async () => {
            const user = {} as User;
            const body = {
                items: [{ id: 1, amount: 2 }],
                buyer: {
                    name: "John Doe",
                    email: "john@example.com",
                    address: "123 Street",
                    phone: "+380551234567",
                },
            };
            const products = [
                {
                    id: 1,
                    name: "Product 1",
                    images: [{ img_src: "image.jpg" }],
                    price: 10,
                    discount: 0,
                    shipping_cost: 5,
                    inventory: 10,
                },
            ];
            const order = { id: 1, shipping_cost: 5 };
            const sessionUrl = "https://example.com/session";

            prismaServiceMock.$queryRaw.mockImplementation(() => products);
            prismaServiceMock.order.create.mockImplementation(() => order);

            createCheckoutSessionMock.mockImplementation(() => ({
                url: sessionUrl,
            }));

            const result = await service.initializePayment(user, body);
            expect(result).toEqual({ url: sessionUrl });
            expect(prismaServiceMock.$queryRaw).toBeCalledWith(
                getProductsByIdsQuery(body.items.map((i) => i.id)),
            );
            expect(prismaServiceMock.order.create).toBeCalledWith(
                expect.anything(),
            );
            expect(createCheckoutSessionMock).toBeCalledTimes(1);
            expect(createCheckoutSessionMock).toHaveReturnedWith({
                url: sessionUrl,
            });
        });
    });

    describe("resumePayment", () => {
        it("should throw BadRequestException if order is not found", async () => {
            const user = { id: 1 } as User;
            const orderId = 123;
            prismaServiceMock.$queryRaw.mockImplementation(() => []);

            const result = service.resumePayment(user, orderId);
            await expect(result).rejects.toThrow(BadRequestException);
            expect(prismaServiceMock.$queryRaw).toHaveBeenCalledWith(
                getOrdersByOrderIdQuery(orderId),
            );
        });

        it("should throw BadRequestException if order does not belong to the user", async () => {
            const user = { id: 1 } as User;
            const orderId = 123;
            prismaServiceMock.$queryRaw.mockImplementation(() => [
                { user_id: 2 },
            ]);

            const result = service.resumePayment(user, orderId);
            await expect(result).rejects.toThrow(BadRequestException);
            expect(prismaServiceMock.$queryRaw).toHaveBeenCalledWith(
                getOrdersByOrderIdQuery(orderId),
            );
        });

        it("should throw BadRequestException if order status is not 'PENDING'", async () => {
            const user = { id: 1 } as User;
            const orderId = 123;
            prismaServiceMock.$queryRaw.mockImplementation(() => [
                { user_id: user.id, status: "ACCEPTED" },
            ]);

            await expect(service.resumePayment(user, orderId)).rejects.toThrow(
                BadRequestException,
            );
            expect(prismaServiceMock.$queryRaw).toHaveBeenCalledWith(
                getOrdersByOrderIdQuery(orderId),
            );
        });

        it("should create a Stripe session and return the session URL", async () => {
            const user = { id: 1 } as User;
            const orderId = 123;
            const order = {
                id: orderId,
                buyer_email: "john@example.com",
                shipping_cost: 10,
                order_items: [],
                user_id: user.id,
                status: "PENDING",
            };
            prismaServiceMock.$queryRaw.mockImplementation(() => [order]);

            createCheckoutSessionMock.mockReset();
            createCheckoutSessionMock.mockImplementation(() => ({
                url: "session-url",
            }));

            const result = await service.resumePayment(user, orderId);
            expect(result).toEqual({ url: "session-url" });
            expect(prismaServiceMock.$queryRaw).toHaveBeenCalledWith(
                getOrdersByOrderIdQuery(orderId),
            );
            expect(createCheckoutSessionMock).toHaveBeenCalledTimes(1);
        });
    });

    describe("stripeWebhook", () => {
        it("should throw BadRequestException if event construction fails", async () => {
            const signature = "signature";
            const body = Buffer.from("body");
            constructEventMock.mockImplementation(() => {
                throw new BadRequestException("Oops! Event Constructor failed");
            });

            await expect(
                service.stripeWebhook(signature, body),
            ).rejects.toThrow(BadRequestException);
            expect(constructEventMock).toHaveBeenCalledWith(
                body,
                signature,
                expect.anything(),
            );
        });

        it("should update order status and remove items from inventory on 'checkout.session.completed' event", async () => {
            const signature = "signature";
            const body = Buffer.from("body");
            const orderId = "order-id";
            const event = {
                type: "checkout.session.completed",
                data: {
                    object: {
                        metadata: {
                            orderId,
                        },
                    },
                },
            };
            const order = { id: orderId, order_items: [{}, {}] };
            const updateOrderItemQueryMock = jest.fn();
            prismaServiceMock.order.update.mockImplementation(() => order);
            prismaServiceMock.$queryRaw.mockImplementation(
                () => updateOrderItemQueryMock,
            );
            constructEventMock.mockReturnValue(event);

            const result = await service.stripeWebhook(signature, body);
            expect(result).toEqual({ received: "true" });
            expect(constructEventMock).toHaveBeenCalledWith(
                body,
                signature,
                expect.anything(),
            );
            expect(prismaServiceMock.order.update).toHaveBeenCalledWith({
                where: {
                    id: +event.data.object.metadata.orderId,
                },
                data: {
                    status: "ACCEPTED",
                    payment_time: expect.any(Date),
                },
                include: {
                    order_items: true,
                },
            });
            expect(prismaServiceMock.$queryRaw).toHaveBeenCalledTimes(
                order.order_items.length,
            );
        });
    });
});
