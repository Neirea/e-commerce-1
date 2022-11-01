import { StatusCodes } from "http-status-codes";

class NotFoundError extends Error {
    status: StatusCodes;
    constructor(message: string) {
        super(message);
        this.status = StatusCodes.NOT_FOUND;
    }
}

export default NotFoundError;
