import { ExtendedCategory, ExtendedCompany } from "../dto/search-data.dto";

export type TShared = Pick<
    ExtendedCategory | ExtendedCompany,
    "id" | "productCount"
>;
export type TProductCount = { [key: TShared["id"]]: number };

type TSharedMap<T extends TShared> = Map<Pick<T, "id">["id"], T>;

export const setAndCount = <T extends TShared>(
    map: TSharedMap<T>,
    item: T,
    count: TProductCount,
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

export const getArrayWithProductCount = <T extends TShared>(
    map: TSharedMap<T>,
    count: TProductCount,
): T[] =>
    Array.from(map, ([key, value]) => {
        value.productCount = count[key];
        return value;
    });
