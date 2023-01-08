import type { Request, Response, NextFunction } from "express";
import CustomError from "../errors/custom-error";

const checkCsrf = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers["csrf-token"] !== req.session.csrfToken) {
        throw new CustomError("Failed to proceed: Bad csrf token", 400);
    }
    next();
};

export default checkCsrf;
