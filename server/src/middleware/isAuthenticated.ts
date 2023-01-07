import type { NextFunction, Request, Response } from "express";
import CustomError from "../errors/custom-error";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.user) {
        throw new CustomError("Authentication Invalid", 401);
    }
    next();
};

export default isAuthenticated;
