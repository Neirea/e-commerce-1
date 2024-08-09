import {
    TCategoryId,
    TCategoryImgId,
    TCategoryImgSrc,
    TCategoryName,
} from "../category.types";
import { Category as TCategory } from "@prisma/client";

export class Category implements Partial<TCategory> {
    id: TCategoryId;
    name: TCategoryName;
    img_id?: TCategoryImgId;
    img_src?: TCategoryImgSrc;
    parent_id?: TCategoryId;
}
