export const getDiscountPrice = (price: number, discount: number) =>
    ((100 - discount) / 100) * price;
