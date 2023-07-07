import { Test } from "@nestjs/testing";
import { ExecutionContext } from "@nestjs/common";
import { RolesGuard } from "./roles.guard";
import { Role } from "@prisma/client";
import { Reflector } from "@nestjs/core";

describe("RolesGuard", () => {
    let rolesGuard: RolesGuard;
    let reflector: Reflector;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                RolesGuard,
                {
                    provide: Reflector,
                    useValue: {
                        getAllAndOverride: jest.fn(),
                    },
                },
            ],
        }).compile();

        rolesGuard = moduleRef.get<RolesGuard>(RolesGuard);
        reflector = moduleRef.get<Reflector>(Reflector);
    });

    it("should allow access if no roles are required", () => {
        const executionContext: ExecutionContext = {
            switchToHttp: () => ({
                getRequest: () => ({ user: { role: [Role.ADMIN] } }),
            }),
            getHandler: () => null,
            getClass: () => null,
        } as ExecutionContext;
        jest.spyOn(reflector, "getAllAndOverride").mockImplementationOnce(
            () => [],
        );

        const canActivate = rolesGuard.canActivate(executionContext);

        expect(canActivate).toBe(true);
    });

    it("should allow access if the user has at least one required role", () => {
        const executionContext: ExecutionContext = {
            switchToHttp: () => ({
                getRequest: () => ({ user: { role: [Role.ADMIN, Role.USER] } }),
            }),
            getHandler: () => null,
            getClass: () => null,
        } as ExecutionContext;
        jest.spyOn(reflector, "getAllAndOverride").mockImplementationOnce(
            () => [Role.USER],
        );

        const canActivate = rolesGuard.canActivate(executionContext);

        expect(canActivate).toBe(true);
    });

    it("should deny access if the user does not have any required role", () => {
        const executionContext: ExecutionContext = {
            switchToHttp: () => ({
                getRequest: () => ({ user: { role: Role.USER } }),
            }),
            getHandler: () => null,
            getClass: () => null,
        } as ExecutionContext;
        jest.spyOn(reflector, "getAllAndOverride").mockImplementationOnce(
            () => [Role.EDITOR, Role.ADMIN],
        );

        const canActivate = rolesGuard.canActivate(executionContext);

        expect(canActivate).toBe(false);
    });
});
