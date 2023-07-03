import { Platform, Role } from "@prisma/client";
import {
    UserAddress,
    UserAvatar,
    UserEmail,
    UserFamilyName,
    UserGivenName,
    UserId,
    UserPhone,
    UserPlaftormId,
} from "../user.types";

export class User {
    id: UserId;
    given_name: UserGivenName;
    family_name: UserFamilyName;
    email: UserEmail;
    platform_id: UserPlaftormId;
    platform: Platform;
    address: UserAddress;
    phone: UserPhone;
    role: Role[];
    created_at: Date;
    avatar: UserAvatar;
}
