import { User } from "@prisma/client";

export type TUserId = Pick<User, "id">["id"];
export type TUserGivenName = Pick<User, "given_name">["given_name"];
export type TUserFamilyName = Pick<User, "family_name">["family_name"];
export type TUserPlaftormId = Pick<User, "platform_id">["platform_id"];
export type TUserEmail = Pick<User, "email">["email"];
export type TUserAddress = Pick<User, "address">["address"];
export type TUserPhone = Pick<User, "phone">["phone"];
export type TUserAvatar = Pick<User, "avatar">["avatar"];
