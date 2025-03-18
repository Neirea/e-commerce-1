import {
    Allow,
    IsEmail,
    IsPhoneNumber,
    Length,
    ValidateIf,
} from "class-validator";
import {
    TUserAddress,
    TUserEmail,
    TUserFamilyName,
    TUserGivenName,
    TUserPhone,
} from "../user.types";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
    @Length(2, 30)
    given_name: TUserGivenName;
    @Length(2, 30)
    family_name: TUserFamilyName;
    @ApiProperty({
        description: "The email of the user",
        example: "someone@gmail.com",
    })
    @IsEmail()
    email: TUserEmail;
    @Allow()
    address: TUserAddress;
    @ValidateIf((o: UpdateUserDto) => (o.phone ? o.phone.length > 0 : false))
    @IsPhoneNumber()
    phone: TUserPhone;
}
