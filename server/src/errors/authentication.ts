import { StatusCodes } from "http-status-codes";

class AuthenticationError extends Error {
	status: StatusCodes;
	constructor(message: string) {
		super(message);
		this.status = StatusCodes.UNAUTHORIZED;
	}
}

export default AuthenticationError;
