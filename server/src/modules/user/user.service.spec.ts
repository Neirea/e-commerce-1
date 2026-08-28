import { Test, TestingModule } from "@nestjs/testing";
import { type Request } from "express";
import { Session, SessionData } from "express-session";
import { TPrismaServiceMock } from "../../utils/types.mock.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";
import { User } from "./entities/user.entity.js";
import { updateUserQuery } from "./user.queries.js";
import { UserService } from "./user.service.js";
import { vi } from "vitest";

describe("UserService", () => {
    let service: UserService;
    let prismaService: TPrismaServiceMock;

    beforeEach(async () => {
        const prismaMock = {
            $queryRaw: vi.fn(),
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: PrismaService, useValue: prismaMock },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        prismaService = module.get<TPrismaServiceMock>(PrismaService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("updateUser", () => {
        it("should update the user and return the updated user object", async () => {
            const req: Partial<Request> = {
                user: {
                    id: 1,
                } as User,
                session: {
                    passport: {
                        user: {} as User,
                    },
                } as Session & Partial<SessionData>,
            };

            const inputUser: UpdateUserDto = {
                given_name: "John",
                family_name: "Doe",
                email: "example@gmail.com",
                phone: "+380551234567",
                address: "",
            };
            const updatedUser = { ...inputUser, id: 1 };
            prismaService.$queryRaw.mockImplementation(() => [updatedUser]);

            const result = await service.updateUser(req as Request, inputUser);

            expect(result).toEqual(updatedUser);
            expect(req.session!.passport!.user).toEqual(updatedUser);
            expect(prismaService.$queryRaw).toHaveBeenCalledWith(
                updateUserQuery(req.user!.id, inputUser),
            );
        });
    });
});
