import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { User } from "../../database/generated/client.js";
import { appConfig } from "../../config/env.js";
import { TPrismaServiceMock } from "../../utils/types.mock.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { CheckoutBodyDto } from "./dto/checkout-body.dto.js";
import { PaymentService } from "./payment.service.js";
import { vi } from "vitest";

const createPaymentIntent = vi.fn();
const constructEventMock = vi.fn();

vi.mock("stripe", () => {
    return {
        default: vi.fn().mockImplementation(function () {
            return {
                paymentIntents: {
                    create: createPaymentIntent,
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
    let prismaService: TPrismaServiceMock;

    beforeEach(async () => {
        const prismaMock = {
            $queryRaw: vi.fn(),
            $transaction: vi.fn(),
            order: {
                create: vi.fn(),
            },
        } as TPrismaServiceMock;
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentService,
                {
                    provide: PrismaService,
                    useValue: prismaMock,
                },
            ],
        }).compile();

        service = module.get<PaymentService>(PaymentService);
        prismaService = module.get<TPrismaServiceMock>(PrismaService);
    });

    afterEach(() => {
        constructEventMock.mockClear();
        createPaymentIntent.mockClear();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("initializePayment", () => {
        let user: User;
        let body: CheckoutBodyDto;
        beforeEach(() => {
            user = {} as User;
            body = {
                items: [],
            };
        });

        it("should throw BadRequestException if cart is empty", async () => {
            await expect(service.initializePayment(user, body)).rejects.toThrow(
                BadRequestException,
            );
        });

        it("should throw BadRequestException if cart has invalid item", async () => {
            await expect(service.initializePayment(user, body)).rejects.toThrow(
                BadRequestException,
            );
        });

        it("should create paymentIntent and return a CheckoutResponseDto with clientSecret", async () => {
            body.items = [{ id: 1, amount: 2 }];
            const products = [
                {
                    id: 1,
                    name: "Product 1",
                    images: [{ img_src: "image.jpg" }],
                    price: 1000,
                    discount: 0,
                    shipping_cost: 5,
                    inventory: 10,
                },
            ];
            const clientSecret = "secret";

            prismaService.$queryRaw.mockImplementation(() => products);

            createPaymentIntent.mockImplementation(() => ({
                client_secret: clientSecret,
            }));

            const result = await service.initializePayment(user, body);

            expect(result).toEqual({ clientSecret: clientSecret });
            expect(createPaymentIntent).toHaveBeenCalledTimes(1);
            expect(createPaymentIntent).toHaveReturnedWith({
                client_secret: clientSecret,
            });
        });
    });

    describe("stripeWebhook", () => {
        it("should throw BadRequestException if event construction fails", async () => {
            const signature = "signature";
            const body = Buffer.from("body");
            const webhook = appConfig.stripeWebhookSecret;
            constructEventMock.mockImplementation(() => {
                throw new BadRequestException("Oops! Event Constructor failed");
            });

            await expect(
                service.stripeWebhook(signature, body),
            ).rejects.toThrow(BadRequestException);
            expect(constructEventMock).toHaveBeenCalledWith(
                body,
                signature,
                webhook,
            );
        });

        it("should create order and remove items from inventory on 'charge.succeeded' event", async () => {
            const signature = "signature";
            const body = Buffer.from("body");
            const webhook = appConfig.stripeWebhookSecret;
            const order = { id: 1, order_items: [{}, {}] };
            const event = {
                type: "charge.succeeded",
                data: {
                    object: {
                        shipping: {
                            name: "Jack Sparrow",
                            address: {},
                        },
                        billing_details: {
                            email: "test@test.com",
                        },
                        metadata: {
                            user_id: 1,
                            shipping_cost: 15,
                            order_items: JSON.stringify(order.order_items),
                        },
                    },
                },
            };
            const createOrderItemQueryMock = vi.fn();
            prismaService.order.create.mockImplementation(() => order);
            prismaService.$queryRaw.mockImplementation(
                () => createOrderItemQueryMock,
            );
            constructEventMock.mockReturnValue(event);

            const result = await service.stripeWebhook(signature, body);
            const createOrder = vi.spyOn(prismaService.order, "create");

            expect(result).toEqual({ received: "true" });
            expect(constructEventMock).toHaveBeenCalledWith(
                body,
                signature,
                webhook,
            );
            expect(createOrder).toHaveBeenCalledWith({
                data: {
                    user_id: 1,
                    buyer_email: "test@test.com",
                    buyer_name: "Jack Sparrow",
                    buyer_phone: undefined,
                    delivery_address: {},
                    order_items: {
                        createMany: {
                            data: [{}, {}],
                        },
                    },
                    shipping_cost: 15,
                },
                include: {
                    order_items: true,
                },
            });
            expect(prismaService.$queryRaw).toHaveBeenCalledTimes(
                order.order_items.length,
            );
        });
    });
});
