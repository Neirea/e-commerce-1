import {
    TProductId,
    TPropductImgId,
    TPropductImgSrc,
} from "../product.types.js";
import { ProductImage as TProductImage } from "../../../database/generated/client.js";

export class ProductImage implements TProductImage {
    img_id: TPropductImgId;
    img_src: TPropductImgSrc;
    product_id: TProductId;
}
