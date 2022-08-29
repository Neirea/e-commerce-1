import { IUser } from "../model-types";

declare global {
	namespace Express {
		interface User {
			user: IUser;
			accessToken: string | undefined;
		}
	}
}
