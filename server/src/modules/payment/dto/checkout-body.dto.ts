import { Type } from "class-transformer";
import { IsArray, IsNumber, ValidateNested } from "class-validator";
import { type TProductId } from "../../../modules/product/product.types.js";

export class ItemDto {
    @IsNumber()
    id: TProductId;
    @IsNumber()
    amount: number;
}

export class CheckoutBodyDto {
    @ValidateNested({ each: true })
    @Type(() => ItemDto)
    @IsArray()
    items: ItemDto[];
}
