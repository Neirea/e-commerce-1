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
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
    @Length(2, 30)
    given_name: UserGivenName;
    @Length(2, 30)
    family_name: UserFamilyName;
    @ApiProperty({
        description: "The email of the user",
        example: "someone@gmail.com",
    })
    @IsEmail()
    email: UserEmail;
    @Allow()
    address: UserAddress;
    @ValidateIf((o) => o.phone.length > 0)
    @IsPhoneNumber()
    phone: UserPhone;
}
