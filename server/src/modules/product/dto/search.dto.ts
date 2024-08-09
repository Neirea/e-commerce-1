import { TProductId } from "../product.types";

export class SearchResponseDto {
    id: TProductId;
    name: string;
    source: "Category" | "Company" | "Product";
}
