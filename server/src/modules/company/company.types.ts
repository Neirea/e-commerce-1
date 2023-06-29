import { Company } from "@prisma/client";

export type CompanyId = Pick<Company, "id">["id"];
export type CompanyName = Pick<Company, "name">["name"];
