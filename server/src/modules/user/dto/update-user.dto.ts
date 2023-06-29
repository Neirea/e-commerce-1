import { IsEmail, IsOptional, IsPhoneNumber, Length } from "class-validator";
import {
    UserAddress,
    UserEmail,
    UserFamilyName,
    UserGivenName,
    UserId,
    UserPhone,
} from "../user.types";

export class UpdateUserDto {
    id: UserId;
    @Length(2, 30)
    given_name: UserGivenName;
    @Length(2, 30)
    family_name: UserFamilyName;
    @IsEmail()
    email: UserEmail;
    @IsOptional()
    address: UserAddress;
    @IsOptional()
    @IsPhoneNumber()
    phone: UserPhone;
}
