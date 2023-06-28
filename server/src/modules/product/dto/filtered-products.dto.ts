export class FilteredProductsDto {
    limit: number;
    offset: number;
    product: {
        category_id: number;
        company_id: number;
        min_price: number;
        max_price: number;
        sort_mode: number;
        search_string: string;
    };
}
