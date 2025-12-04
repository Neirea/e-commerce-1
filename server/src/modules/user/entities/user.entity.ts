import { Platform, Role, User as TUser } from "src/database/generated/client";
import {
    TUserAddress,
    TUserAvatar,
    TUserEmail,
    TUserFamilyName,
    TUserGivenName,
    TUserId,
    TUserPhone,
    TUserPlaftormId,
} from "../user.types";
import { ApiProperty } from "@nestjs/swagger";

export class User implements TUser {
    id: TUserId;
    given_name: TUserGivenName;
    family_name: TUserFamilyName;
    @ApiProperty({
        description: "The email of the user",
        example: "someone@gmail.com",
    })
    email: TUserEmail;
    platform_id: TUserPlaftormId;
    @ApiProperty({ enum: ["GOOGLE", "FACEBOOK"] })
    platform: Platform;
    address: TUserAddress;
    phone: TUserPhone;
    @ApiProperty({ enum: ["USER", "ADMIN", "EDITOR"] })
    role: Role[];
    created_at: Date;
    avatar: TUserAvatar;
}
