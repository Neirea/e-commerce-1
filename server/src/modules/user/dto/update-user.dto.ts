import {
    Allow,
    IsEmail,
    IsPhoneNumber,
    Length,
    ValidateIf,
} from "class-validator";
import {
    UserAddress,
    UserEmail,
    UserFamilyName,
    UserGivenName,
    UserPhone,
} from "../user.types";

export class UpdateUserDto {
    @Length(2, 30)
    given_name: UserGivenName;
    @Length(2, 30)
    family_name: UserFamilyName;
    @IsEmail()
    email: UserEmail;
    @Allow()
    address: UserAddress;
    @ValidateIf((o) => o.phone.length > 0)
    @IsPhoneNumber()
    phone: UserPhone;
}
