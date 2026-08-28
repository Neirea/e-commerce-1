import { Product } from "../entities/product.entity.js";

export class ProductWithVariantsDto extends Product {
    variants: Product[];
}
