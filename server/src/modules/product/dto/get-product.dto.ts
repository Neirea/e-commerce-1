import { Product } from "../entities/product.entity";

export class ProductWithVariantsDto extends Product {
    variants: Product[];
}
