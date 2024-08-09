import { TProductId, TPropductImgId, TPropductImgSrc } from "../product.types";
import { ProductImage as TProductImage } from "@prisma/client";

export class ProductImage implements TProductImage {
    img_id: TPropductImgId;
    img_src: TPropductImgSrc;
    product_id: TProductId;
}
