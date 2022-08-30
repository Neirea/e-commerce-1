import type { Role, Platform } from "@prisma/client";

export interface IUser {
	id: number;
	name: string;
	username: string;
	email: string;
	platform: Platform;
	role: Role;
	avatar: string;
	created_at: Date;
}
