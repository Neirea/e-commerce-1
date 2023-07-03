import { ProductId } from "../product.types";

export class SearchResponseDto {
    id: ProductId;
    name: string;
    source: "Category" | "Company" | "Product";
}
