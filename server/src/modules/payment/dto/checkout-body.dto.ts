import { Type } from "class-transformer";
import {
    IsArray,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsPhoneNumber,
    IsString,
    ValidateIf,
    ValidateNested,
} from "class-validator";
import { TProductId } from "src/modules/product/product.types";

export class ItemDto {
    @IsNumber()
    id: TProductId;
    @IsNumber()
    amount: number;
}

export class BuyerDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsEmail()
    email: string;
    @IsString()
    @IsNotEmpty()
    address: string;
    @ValidateIf((o) => o.phone.length > 0)
    @IsPhoneNumber()
    phone: string;
}

export class CheckoutBodyDto {
    @ValidateNested({ each: true })
    @Type(() => ItemDto)
    @IsArray()
    items: ItemDto[];

    @ValidateNested()
    @Type(() => BuyerDto)
    buyer: BuyerDto;
}
