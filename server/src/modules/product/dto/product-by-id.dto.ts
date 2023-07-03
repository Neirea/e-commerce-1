import { Company } from "src/modules/company/entities/company.entity";
import { ProductWithImagesDto } from "./product-with-images.dto";
import { Category } from "src/modules/category/entities/category.entity";

export class ProductByIdResponseDto extends ProductWithImagesDto {
    company: Company;
    category: Category;
}
