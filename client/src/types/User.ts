export type TPlatform = "GOOGLE" | "FACEBOOK";
export type TRole = "USER" | "ADMIN" | "EDITOR";

export type TAddress = {
    city: string;
    country: string;
    line1: string;
    line2: string | null;
    postal_code: string;
    state: string;
};

export type TUser = {
    id: number;
    given_name: string;
    family_name: string;
    email: string;
    platform_id: string;
    platform: TPlatform;
    address: TAddress;
    phone: string;
    role: TRole[];
    created_at: Date;
    avatar: string;
};

export type TUpdateUserParams = {
    given_name: string;
    family_name: string;
    email: string;
    address: TAddress;
    phone: string;
};
