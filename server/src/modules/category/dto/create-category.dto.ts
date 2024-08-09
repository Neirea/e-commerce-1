import { IsOptional, IsUrl, Length, ValidateIf } from "class-validator";
import {
    TCategoryImgId,
    TCategoryImgSrc,
    TCategoryName,
    TCategoryId,
} from "../category.types";

export class createCategoryDto {
    @Length(3, 30)
    name: TCategoryName;
    @ValidateIf((o) => o.img_src?.length > 0)
    @IsOptional()
    img_id?: TCategoryImgId;
    @ValidateIf((o) => o.img_id?.length > 0)
    @IsOptional()
    @IsUrl()
    img_src?: TCategoryImgSrc;
    @IsOptional()
    parent_id?: TCategoryId;
}
