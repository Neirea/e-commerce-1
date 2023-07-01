export const getDiscountPrice = (price: number, discount: number): number =>
    ((100 - discount) / 100) * price;
