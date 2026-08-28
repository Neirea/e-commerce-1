import { TCompanyId, TCompanyName } from "../company.types.js";
import { Company as TCompany } from "../../../database/generated/client.js";

export class Company implements TCompany {
    id: TCompanyId;
    name: TCompanyName;
}
