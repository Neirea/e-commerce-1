import { Test, TestingModule } from "@nestjs/testing";
import { Request, Response } from "express";
import { Profile } from "passport-google-oauth20";
import { appConfig } from "../../config/env.js";
import { Platform, Role } from "../../database/generated/client.js";
import { TExpressSessionDestroyMock } from "../../utils/types.mock.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { User } from "../user/entities/user.entity.js";
import { userByPlatformIdQuery } from "./auth.queries.js";
import { AuthService } from "./auth.service.js";
import { Mock, vi } from "vitest";

type PrismaServiceMock = {
    $queryRaw: Mock;
    $transaction: Mock;
    user: {
        create: Mock;
    };
};

describe("AuthService", () => {
    let service: AuthService;
    let prismaService: PrismaServiceMock;

    beforeEach(async () => {
        const prismaMock: PrismaServiceMock = {
            $queryRaw: vi.fn(),
            $transaction: vi.fn(),
            user: { create: vi.fn() },
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: PrismaService,
                    useValue: prismaMock,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        prismaService = module.get<PrismaServiceMock>(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("validateUser", () => {
        let mockProfile: Profile;
        let mockUser: Partial<User>;

        beforeEach(() => {
            mockProfile = {
                id: "123456789",
                name: {
                    givenName: "John",
                    familyName: "Doe",
                },
                provider: "google",
                profileUrl: "",
                photos: [{ value: "photo_url" }],
                emails: [{ value: "john.doe@example.com", verified: true }],
                displayName: "John Doe",
                _raw: "",
                _json: {
                    iat: 1353601026,
                    exp: 1353604926,
                    sub: "10769150350006150715113082367",
                    aud: "1234987819200.apps.googleusercontent.com",
                    iss: "https://accounts.google.com",
                },
            };
            mockUser = {
                id: 1,
                given_name: "John Doe",
                platform_id: "123456789",
            };
        });

        it("should return existing user if found", async () => {
            prismaService.$queryRaw.mockResolvedValue([mockUser]);

            const result = await service.validateUser(
                mockProfile,
                Platform.GOOGLE,
            );

            expect(prismaService.$queryRaw).toHaveBeenCalledWith(
                userByPlatformIdQuery(mockProfile.id),
            );
            expect(result).toEqual(mockUser);
        });
        it("should return a new user if not found", async () => {
            prismaService.$queryRaw
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce([{ count: 1 }]);

            prismaService.user.create.mockResolvedValueOnce(mockUser);

            const result = await service.validateUser(
                mockProfile,
                Platform.FACEBOOK,
            );

            expect(prismaService.$queryRaw).toHaveBeenCalledTimes(2);
            expect(prismaService.user.create).toHaveBeenCalledWith({
                data: {
                    given_name: "John",
                    family_name: "Doe",
                    platform_id: "123456789",
                    platform: Platform.FACEBOOK,
                    role: [Role.USER],
                    email: "john.doe@example.com",
                    address: "",
                    avatar: "photo_url",
                },
            });
            expect(prismaService.user.create).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockUser);
        });
    });

    describe("exitSession", () => {
        let mockRequest: {
            session: {
                destroy(callback: (err: any) => void): void;
            };
        };
        let mockResponse: {
            clearCookie(name: string, options?: any): any;
        };

        const mockDestroy: TExpressSessionDestroyMock = (err) =>
            vi.fn((callback: (err?: any) => void) => {
                callback(err);
            });
        const mockDestroyWithNoError = mockDestroy(null);
        const mockClearCookie = vi.fn();

        beforeEach(() => {
            mockRequest = {
                session: {
                    destroy: mockDestroyWithNoError,
                },
            };
            mockResponse = {
                clearCookie: mockClearCookie,
            };
        });

        it("should destroy session and clear cookie", () => {
            service.exitSession(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(mockDestroyWithNoError).toHaveBeenCalled();
            expect(mockClearCookie).toHaveBeenCalledWith("techway_sid", {
                domain: appConfig.serverDomain,
            });
        });

        it("should throw BadRequestException if session destroy fails", () => {
            mockRequest.session.destroy = mockDestroy("Session destroy error");

            expect(() =>
                service.exitSession(
                    mockRequest as Request,
                    mockResponse as Response,
                ),
            ).toThrow("Failed to logout");
        });
    });
});
