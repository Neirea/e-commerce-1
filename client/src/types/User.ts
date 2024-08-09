export type TPlatform = "GOOGLE" | "FACEBOOK";
export type TRole = "USER" | "ADMIN" | "EDITOR";

export type TUser = {
    id: number;
    given_name: string;
    family_name: string;
    email: string;
    platform_id: string;
    platform: TPlatform;
    address: string;
    phone: string;
    role: TRole[];
    created_at: Date;
    avatar: string;
};

export type TUpdateUserParams = {
    given_name: string;
    family_name: string;
    email: string;
    address: string;
    phone: string;
};
