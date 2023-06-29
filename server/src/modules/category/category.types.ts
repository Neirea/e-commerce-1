import { Category } from "@prisma/client";

export type CateogoryId = Pick<Category, "id">["id"];
export type CategoryName = Pick<Category, "name">["name"];
export type CategoryImgId = Pick<Category, "img_id">["img_id"];
export type CategoryImgSrc = Pick<Category, "img_src">["img_src"];
