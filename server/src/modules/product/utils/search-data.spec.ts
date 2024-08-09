import {
    setAndCount,
    getPriceCondition,
    getArrayWithProductCount,
    TShared,
    TProductCount,
} from "./search-data";

describe("setAndCount", () => {
    it("should add item to the map and increment the count", () => {
        const map = new Map<number, TShared>();
        const item: TShared = { id: 1, productCount: 0 };
        const count: TProductCount = {};

        setAndCount(map, item, count);

        expect(map.size).toBe(1);
        expect(map.get(1)).toBe(item);
        expect(count[1]).toBe(1);
    });

    it("should increment the count for existing item in the map", () => {
        const map = new Map<number, TShared>();
        const item: TShared = { id: 1, productCount: 0 };
        const count: TProductCount = { 1: 2 };

        setAndCount(map, item, count);

        expect(map.size).toBe(1);
        expect(map.get(1)).toBe(item);
        expect(count[1]).toBe(3);
    });
});

describe("getPriceCondition", () => {
    it("should return true if price is within the range", () => {
        const price = 50;
        const min = 10;
        const max = 100;

        const result = getPriceCondition(price, min, max);

        expect(result).toBe(true);
    });

    it("should return true if price range is not provided", () => {
        const price = 50;
        const min = undefined;
        const max = undefined;

        const result = getPriceCondition(price, min, max);

        expect(result).toBe(true);
    });

    it("should return false if price is below the minimum range", () => {
        const price = 5;
        const min = 10;
        const max = 100;

        const result = getPriceCondition(price, min, max);

        expect(result).toBe(false);
    });

    it("should return false if price is above the maximum range", () => {
        const price = 150;
        const min = 10;
        const max = 100;

        const result = getPriceCondition(price, min, max);

        expect(result).toBe(false);
    });
});

describe("getArrayWithProductCount", () => {
    it("should return an array of shared items with product counts", () => {
        const map = new Map<number, TShared>();
        const item1: TShared = { id: 1, productCount: 0 };
        const item2: TShared = { id: 2, productCount: 0 };
        map.set(1, item1);
        map.set(2, item2);
        const count: TProductCount = { 1: 3, 2: 5 };

        const result = getArrayWithProductCount(map, count);

        expect(result.length).toBe(2);
        expect(result[0]).toBe(item1);
        expect(result[0].productCount).toBe(3);
        expect(result[1]).toBe(item2);
        expect(result[1].productCount).toBe(5);
    });
});
