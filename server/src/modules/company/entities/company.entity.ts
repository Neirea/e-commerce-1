import { TCompanyId, TCompanyName } from "../company.types";
import { Company as TCompany } from "src/database/generated/client";

export class Company implements TCompany {
    id: TCompanyId;
    name: TCompanyName;
}
