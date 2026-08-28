import { Category } from "../../../modules/category/entities/category.entity.js";
import { Company } from "../entities/company.entity.js";

export class CompanyWithCategoriesDto extends Company {
    categories: Category[];
}
