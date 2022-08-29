export enum platformEnum {
	github = "facebook",
	google = "google",
}

export enum userRoles {
	admin = "admin",
	user = "user",
}

export interface IUser {
	id: number;
	name: string;
	username: string;
	email: string;
	platform: platformEnum;
	role: userRoles[];
	avatar: string;
	created_at: string;
}
