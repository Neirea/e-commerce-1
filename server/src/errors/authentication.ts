import { StatusCodes } from "http-status-codes";

class AuthenticationError extends Error {
	statusCode: StatusCodes;
	constructor(message: string) {
		super(message);
		this.statusCode = StatusCodes.UNAUTHORIZED;
	}
}

export default AuthenticationError;
