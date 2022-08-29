import "express-session";

declare module "express-session" {
	interface SessionData {
		user: import("../model-types").IUser;
		accessToken: string | undefined;
	}
}
