import { Category } from "src/modules/category/entities/category.entity";
import { Company } from "../entities/company.entity";

export class CompanyWithCategoriesDto extends Company {
    categories: Category[];
}
