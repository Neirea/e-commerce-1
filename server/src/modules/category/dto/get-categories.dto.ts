import { Company } from "../../company/entities/company.entity.js";
import { Category } from "../entities/category.entity.js";

export class CategoryWithCompaniesDto extends Category {
    companies: Company[];
}
