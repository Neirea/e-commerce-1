import { TProductId, TPropductImgId, TPropductImgSrc } from "../product.types";
import { ProductImage as TProductImage } from "src/database/generated/client";

export class ProductImage implements TProductImage {
    img_id: TPropductImgId;
    img_src: TPropductImgSrc;
    product_id: TProductId;
}
