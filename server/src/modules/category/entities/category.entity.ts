import {
    CategoryId,
    CategoryImgId,
    CategoryImgSrc,
    CategoryName,
} from "../category.types";
import { Category as ICategory } from "@prisma/client";

export class Category implements ICategory {
    id: CategoryId;
    name: CategoryName;
    img_id: CategoryImgId;
    img_src: CategoryImgSrc;
    parent_id: CategoryId;
}
