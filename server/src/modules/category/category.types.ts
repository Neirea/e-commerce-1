import { Category } from "@prisma/client";

export type TCategoryId = Pick<Category, "id">["id"];
export type TCategoryName = Pick<Category, "name">["name"];
export type TCategoryImgId = Pick<Category, "img_id">["img_id"];
export type TCategoryImgSrc = Pick<Category, "img_src">["img_src"];
