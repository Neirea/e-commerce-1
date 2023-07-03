import {
    CategoryId,
    CategoryImgId,
    CategoryImgSrc,
    CategoryName,
} from "../category.types";

export class Category {
    id: CategoryId;
    name: CategoryName;
    img_id: CategoryImgId;
    img_src: CategoryImgSrc;
    parent_id: CategoryId;
}
