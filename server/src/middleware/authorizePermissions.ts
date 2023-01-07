import type { NextFunction, Request, Response } from "express";
import CustomError from "../errors/custom-error";
import { Role } from "@prisma/client";

const authorizePermissions = (roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.some((role) => req.session.user?.role.includes(role))) {
            throw new CustomError("Authorization failed", 403);
        }
        next();
    };
};

export default authorizePermissions;
