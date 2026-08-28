import {
    TCategoryId,
    TCategoryImgId,
    TCategoryImgSrc,
    TCategoryName,
} from "../category.types.js";
import { Category as TCategory } from "../../../database/generated/client.js";

export class Category implements Partial<TCategory> {
    id: TCategoryId;
    name: TCategoryName;
    img_id?: TCategoryImgId;
    img_src?: TCategoryImgSrc;
    parent_id?: TCategoryId;
}
