import { Type } from "class-transformer";
import { IsArray, IsNumber, ValidateNested } from "class-validator";
import { TProductId } from "src/modules/product/product.types";

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
