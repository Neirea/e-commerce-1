import { CompanyId, CompanyName } from "../company.types";
import { Company as ICompany } from "@prisma/client";

export class Company implements ICompany {
    id: CompanyId;
    name: CompanyName;
}
