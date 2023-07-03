import { ExtendedCategory, ExtendedCompany } from "../dto/search-data.dto";

export type ProductCountType = { [key: string]: number };
export type SharedType = Pick<
    ExtendedCategory | ExtendedCompany,
    "id" | "productCount"
>;
type SharedMapType<T extends SharedType> = Map<Pick<T, "id">["id"], T>;

export const setAndCount = <T extends SharedType>(
    map: SharedMapType<T>,
    item: T,
    count: ProductCountType,
): void => {
    if (!map.has(item.id)) {
        map.set(item.id, item);
    }
    count[item.id] = (count[item.id] || 0) + 1;
};
// if price range exists or it doesn't
export const getPriceCondition = (
    price: number,
    min: number,
    max: number,
): boolean => {
    const minPrice = min ?? 0;
    const maxPrice = max ?? Infinity;
    return (
        ((max || min) && price <= maxPrice && price >= minPrice) ||
        (!max && !min)
    );
};

export const getArrayWithProductCount = <T extends SharedType>(
    map: SharedMapType<T>,
    count: ProductCountType,
): T[] =>
    Array.from(map, ([key, value]) => {
        value.productCount = count[key];
        return value;
    });
