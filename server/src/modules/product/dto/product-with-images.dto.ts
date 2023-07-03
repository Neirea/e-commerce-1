import { ProductImage } from "../entities/product-image.entity";
import { Product } from "../entities/product.entity";

export class ProductWithImagesDto extends Product {
    images: ProductImage[];
}
