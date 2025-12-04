import { ExecutionContext } from "@nestjs/common";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { Reflector } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { Role } from "src/database/generated/client";
import { RolesGuard } from "./roles.guard";

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
        const executionContext: Partial<ExecutionContext> = {
            switchToHttp: () =>
                ({
                    getRequest: () => ({ user: { role: [Role.ADMIN] } }),
                }) as HttpArgumentsHost,
            getHandler: () => () => {},
            getClass: <T>() => null as T,
        };

        jest.spyOn(reflector, "getAllAndOverride").mockImplementationOnce(
            () => [],
        );

        const canActivate = rolesGuard.canActivate(
            executionContext as ExecutionContext,
        );

        expect(canActivate).toBe(true);
    });

    it("should allow access if the user has at least one required role", () => {
        const executionContext: Partial<ExecutionContext> = {
            switchToHttp: () =>
                ({
                    getRequest: () => ({
                        user: { role: [Role.ADMIN, Role.USER] },
                    }),
                }) as HttpArgumentsHost,
            getHandler: () => () => {},
            getClass: <T>() => null as T,
        };

        jest.spyOn(reflector, "getAllAndOverride").mockImplementationOnce(
            () => [Role.USER],
        );

        const canActivate = rolesGuard.canActivate(
            executionContext as ExecutionContext,
        );

        expect(canActivate).toBe(true);
    });

    it("should deny access if the user does not have any required role", () => {
        const executionContext: Partial<ExecutionContext> = {
            switchToHttp: () =>
                ({
                    getRequest: () => ({
                        user: { role: Role.USER },
                    }),
                }) as HttpArgumentsHost,
            getHandler: () => () => {},
            getClass: <T>() => null as T,
        };
        jest.spyOn(reflector, "getAllAndOverride").mockImplementationOnce(
            () => [Role.EDITOR, Role.ADMIN],
        );

        const canActivate = rolesGuard.canActivate(
            executionContext as ExecutionContext,
        );

        expect(canActivate).toBe(false);
    });
});
