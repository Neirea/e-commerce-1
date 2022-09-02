import type { Role, Platform } from "@prisma/client";

export interface IUser {
	id: number;
	given_name: string;
	family_name: string;
	email: string;
	platform: Platform;
	platform_id: string;
	role: Role;
	avatar: string;
	created_at: Date;
}
