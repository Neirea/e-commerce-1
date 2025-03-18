import { IsOptional, IsUrl, Length, ValidateIf } from "class-validator";
import {
    TCategoryImgId,
    TCategoryImgSrc,
    TCategoryName,
    TCategoryId,
} from "../category.types";

export class CreateCategoryDto {
    @Length(3, 30)
    name: TCategoryName;
    @ValidateIf((o: CreateCategoryDto) =>
        o.img_src ? o.img_src.length > 0 : false,
    )
    @IsOptional()
    img_id?: TCategoryImgId;
    @ValidateIf((o: CreateCategoryDto) =>
        o.img_id ? o.img_id.length > 0 : false,
    )
    @IsOptional()
    @IsUrl()
    img_src?: TCategoryImgSrc;
    @IsOptional()
    parent_id?: TCategoryId;
}
