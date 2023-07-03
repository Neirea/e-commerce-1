import { Category, Company } from "@prisma/client";

export type CategoryId = Pick<Category, "id">["id"];
export type CategoryName = Pick<Category, "name">["name"];
export type CategoryImgId = Pick<Category, "img_id">["img_id"];
export type CategoryImgSrc = Pick<Category, "img_src">["img_src"];

export type CategoryWithCompanies = Category & { companies: Company[] };
