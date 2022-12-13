import { StatusCodes } from "http-status-codes";

export default class BadRequestError extends Error {
    statusCode: StatusCodes;
    constructor(message: string, statusCode: StatusCodes) {
        super(message);
        this.statusCode = statusCode;
    }
}
