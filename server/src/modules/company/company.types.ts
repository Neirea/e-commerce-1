import { Company } from "@prisma/client";

export type TCompanyId = Pick<Company, "id">["id"];
export type TCompanyName = Pick<Company, "name">["name"];
