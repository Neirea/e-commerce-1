import { IsOptional, IsUrl, Length, ValidateIf } from "class-validator";
import {
    CategoryImgId,
    CategoryImgSrc,
    CategoryName,
    CategoryId,
} from "../category.types";

export class createCategoryDto {
    @Length(3, 20)
    name: CategoryName;
    @ValidateIf((o) => o.img_src?.length > 0)
    @IsOptional()
    img_id?: CategoryImgId;
    @ValidateIf((o) => o.img_id?.length > 0)
    @IsOptional()
    @IsUrl()
    img_src?: CategoryImgSrc;
    @IsOptional()
    parent_id?: CategoryId;
}
