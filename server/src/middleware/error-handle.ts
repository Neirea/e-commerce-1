import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../logger";

const errorHandlerMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // set default error
    const customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || "Something went wrong try again later",
    };

    logger.error(customError.message);

    return res
        .status(customError.statusCode)
        .json({ message: customError.message });
};

export default errorHandlerMiddleware;
