import {
    CategoryId,
    CategoryImgId,
    CategoryImgSrc,
    CategoryName,
} from "../category.types";
import { Prisma } from "@prisma/client";

export class Category implements Prisma.CategoryCreateInput {
    id: CategoryId;
    name: CategoryName;
    img_id?: CategoryImgId;
    img_src?: CategoryImgSrc;
    parent_id?: CategoryId;
}
