import { User } from "@prisma/client";

export type UserId = Pick<User, "id">["id"];
export type UserGivenName = Pick<User, "given_name">["given_name"];
export type UserFamilyName = Pick<User, "family_name">["family_name"];
export type UserEmail = Pick<User, "email">["email"];
export type UserAddress = Pick<User, "address">["address"];
export type UserPhone = Pick<User, "phone">["phone"];
