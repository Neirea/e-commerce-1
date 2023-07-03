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
import { ApiProperty } from "@nestjs/swagger";

export class User {
    id: UserId;
    given_name: UserGivenName;
    family_name: UserFamilyName;
    @ApiProperty({
        description: "The email of the user",
        example: "someone@gmail.com",
    })
    email: UserEmail;
    platform_id: UserPlaftormId;
    @ApiProperty({ enum: ["GOOGLE", "FACEBOOK"] })
    platform: Platform;
    address: UserAddress;
    phone: UserPhone;
    @ApiProperty({ enum: ["USER", "ADMIN", "EDITOR"] })
    role: Role[];
    created_at: Date;
    avatar: UserAvatar;
}
