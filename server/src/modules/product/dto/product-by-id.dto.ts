import { Company } from "../../../modules/company/entities/company.entity.js";
import { ProductWithImagesDto } from "./product-with-images.dto.js";
import { Category } from "../../../modules/category/entities/category.entity.js";

export class ProductByIdResponseDto extends ProductWithImagesDto {
    company: Company;
    category: Category;
}
