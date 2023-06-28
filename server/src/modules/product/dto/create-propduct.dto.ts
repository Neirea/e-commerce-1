export class CreateProductDto {
    name: string;
    price: number;
    description: Record<string, string>;
    inventory: number;
    shipping_cost: number;
    discount: number;
    img_id: string[];
    img_src: string[];
    company_id: number;
    category_id: number;
    variants: number[];
}
