import { ProductId, PropductImgId, PropductImgSrc } from "../product.types";
import { ProductImage as IProductImage } from "@prisma/client";

export class ProductImage implements IProductImage {
    img_id: PropductImgId;
    img_src: PropductImgSrc;
    product_id: ProductId;
}
