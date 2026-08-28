import { Company } from "../../database/generated/client.js";

export type TCompanyId = Pick<Company, "id">["id"];
export type TCompanyName = Pick<Company, "name">["name"];
