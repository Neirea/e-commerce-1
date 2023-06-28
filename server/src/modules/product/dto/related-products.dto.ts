export class RelatedProductsDto {
    limit: number;
    offset: number;
    product: {
        id: number;
        company_id: number;
        category_id: number;
    };
}
