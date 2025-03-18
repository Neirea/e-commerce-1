import { CanActivate } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Platform, Role } from "@prisma/client";
import { Request, Response } from "express";
import { Profile } from "passport-google-oauth20";
import { appConfig } from "src/config/env";
import {
    TExpressSessionDestroyMock,
    TPrismaServiceMock,
} from "src/utils/types.mock";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "../user/entities/user.entity";
import { AuthController } from "./auth.controller";
import { userByPlatformIdQuery } from "./auth.queries";
import { AuthService } from "./auth.service";
import { SessionSerializer } from "./session.serializer";
import { FacebookStrategy } from "./strategies/facebook.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";

describe("AuthService", () => {
    let service: AuthService;
    let prismaService: TPrismaServiceMock;
    const fakeGuard: CanActivate = { canActivate: () => true };

    beforeEach(async () => {
        const prismaMock = {
            $queryRaw: jest.fn(),
            $transaction: jest.fn(),
            user: { create: jest.fn() },
        } as TPrismaServiceMock;
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                AuthService,
                { provide: GoogleStrategy, useValue: fakeGuard },
                { provide: FacebookStrategy, useValue: fakeGuard },
                SessionSerializer,
                {
                    provide: PrismaService,
                    useValue: prismaMock,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        prismaService = module.get<TPrismaServiceMock>(PrismaService);
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
            prismaService.$queryRaw.mockImplementation(() => [mockUser]);

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
                .mockImplementationOnce(() => [])
                .mockImplementationOnce(() => [{ count: 1 }]);

            prismaService.user.create.mockResolvedValue(mockUser);

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
            jest.fn((callback) => {
                callback(err);
            });
        const mockDestroyWithNoError = mockDestroy(null);
        const mockClearCookie = jest.fn();

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
