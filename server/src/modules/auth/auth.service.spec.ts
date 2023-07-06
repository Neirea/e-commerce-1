import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { GoogleStrategy } from "./strategies/google.strategy";
import { FacebookStrategy } from "./strategies/facebook.strategy";
import { SessionSerializer } from "./session.serializer";
import { PrismaService } from "../prisma/prisma.service";
import { CanActivate } from "@nestjs/common";
import { Profile } from "passport-google-oauth20";
import { Platform, Role } from "@prisma/client";
import { userByPlatformIdQuery } from "./auth.queries";

type prismaServiceMockType = Partial<PrismaService> & {
    $queryRaw: jest.Mock;
    user: { create: jest.Mock };
};

describe("AuthService", () => {
    let service: AuthService;
    let prismaServiceMock: prismaServiceMockType;
    const fakeGuard: CanActivate = { canActivate: () => true };

    beforeEach(async () => {
        prismaServiceMock = {
            $queryRaw: jest.fn(),
            user: {
                create: jest.fn(),
            },
        } as prismaServiceMockType;
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                AuthService,
                { provide: GoogleStrategy, useValue: fakeGuard },
                { provide: FacebookStrategy, useValue: fakeGuard },
                SessionSerializer,
                {
                    provide: PrismaService,
                    useValue: prismaServiceMock,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("validateUser", () => {
        const mockProfile: Profile = {
            id: "123456789",
            name: {
                givenName: "John",
                familyName: "Doe",
            },
            provider: "",
            profileUrl: "",
            photos: [{ value: "photo_url" }],
            emails: [{ value: "john.doe@example.com", verified: "true" }],
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
        const mockUser = {
            id: 1,
            name: "John Doe",
            platformId: "123456789",
        };
        it("should return existing user if found", async () => {
            prismaServiceMock.$queryRaw.mockImplementation(() => [mockUser]);

            const result = await service.validateUser(
                mockProfile,
                Platform.GOOGLE,
            );
            expect(prismaServiceMock.$queryRaw).toHaveBeenCalledWith(
                userByPlatformIdQuery(mockProfile.id),
            );
            expect(result).toEqual(mockUser);
        });
        it("should return a new user if not found", async () => {
            // didn't find user in db and user count = 1
            prismaServiceMock.$queryRaw
                .mockImplementationOnce(() => [])
                .mockImplementationOnce(() => [{ count: 1 }]);

            prismaServiceMock.user.create.mockResolvedValue(mockUser);
            const result = await service.validateUser(
                mockProfile,
                Platform.FACEBOOK,
            );

            expect(prismaServiceMock.$queryRaw).toHaveBeenCalledTimes(2);
            expect(prismaServiceMock.user.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    given_name: "John",
                    family_name: "Doe",
                    platform_id: "123456789",
                    platform: Platform.FACEBOOK,
                    role: [Role.USER],
                    email: "john.doe@example.com",
                }),
            });
            expect(prismaServiceMock.user.create).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockUser);
        });
    });

    describe("exitSession", () => {
        let mockRequest: any;
        let mockResponse: any;

        beforeEach(() => {
            mockRequest = {
                session: {
                    destroy: jest.fn((callback: any) => {
                        callback(null);
                    }),
                },
            };
            mockResponse = {
                clearCookie: jest.fn(),
            };
        });

        it("should destroy session and clear cookie", () => {
            service.exitSession(mockRequest, mockResponse);

            expect(mockRequest.session.destroy).toHaveBeenCalled();
            expect(mockResponse.clearCookie).toHaveBeenCalledWith(
                "techway_sid",
                {
                    domain: process.env.SERVER_DOMAIN,
                },
            );
        });

        it("should throw BadRequestException if session destroy fails", () => {
            mockRequest.session.destroy = jest.fn((callback: any) => {
                callback(new Error("Session destroy error"));
            });

            expect(() =>
                service.exitSession(mockRequest, mockResponse),
            ).toThrowError("Failed to logout");
        });
    });
});
