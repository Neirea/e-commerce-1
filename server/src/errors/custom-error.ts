import { StatusCodes } from "http-status-codes";

// REST API Error
export default class CustomError extends Error {
    statusCode: StatusCodes;
    constructor(message: string, statusCode: StatusCodes) {
        super(message);
        this.statusCode = statusCode;
    }
}
