import { TProductId } from "../product.types.js";

export class SearchResponseDto {
    id: TProductId;
    name: string;
    source: "Category" | "Company" | "Product";
}
