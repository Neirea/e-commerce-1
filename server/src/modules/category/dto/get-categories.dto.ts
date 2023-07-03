import { Company } from "src/modules/company/entities/company.entity";
import { Category } from "../entities/category.entity";

export class CategoryWithCompaniesDto extends Category {
    companies: Company[];
}
