import { StatusCodes } from "http-status-codes";

export default class AuthenticationError extends Error {
    status: StatusCodes;
    constructor(message: string) {
        super(message);
        this.status = StatusCodes.UNAUTHORIZED;
    }
}
