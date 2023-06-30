export type IPlatform = "GOOGLE" | "FACEBOOK";
export type IRole = "USER" | "ADMIN" | "EDITOR";

export type IUser = {
    id: number;
    given_name: string;
    family_name: string;
    email: string;
    platform_id: string;
    platform: IPlatform;
    address: string;
    phone: string;
    role: IRole[];
    created_at: Date;
    avatar: string;
};
