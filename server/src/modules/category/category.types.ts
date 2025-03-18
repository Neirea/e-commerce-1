import { Category } from "@prisma/client";
import { Request } from "express";
import { CreateCategoryDto } from "./dto/create-category.dto";

export type TCategoryId = Pick<Category, "id">["id"];
export type TCategoryName = Pick<Category, "name">["name"];
export type TCategoryImgId = Pick<Category, "img_id">["img_id"];
export type TCategoryImgSrc = Pick<Category, "img_src">["img_src"];

export interface IUpsertCategoryRequest extends Request {
    body: CreateCategoryDto;
}
