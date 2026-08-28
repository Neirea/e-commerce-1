import { ProductImage } from "../entities/product-image.entity.js";
import { Product } from "../entities/product.entity.js";

export class ProductWithImagesDto extends Product {
    images: ProductImage[];
}
