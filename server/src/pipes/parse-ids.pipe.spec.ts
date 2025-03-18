import { BadRequestException } from "@nestjs/common";
import { ParseQuaryArrayPipe } from "./parse-ids.pipe";

describe("parseIdsPipe", () => {
    let pipe: ParseQuaryArrayPipe;

    beforeEach(() => {
        pipe = new ParseQuaryArrayPipe();
    });

    it("should be defined", () => {
        expect(pipe).toBeDefined();
    });

    it("should parse query array string into an array of numbers", async () => {
        const value = "1,2,3,4";
        const transformedValue = (await pipe.transform(value, {
            type: "query",
        })) as number[];

        expect(transformedValue).toEqual([1, 2, 3, 4]);
    });

    it("should return undefined if the value is not provided and optional", async () => {
        const value = undefined;
        const transformedValue = pipe.transform(value, { type: "query" });

        await expect(transformedValue).rejects.toThrow(BadRequestException);
    });

    it(`should throw error for non numbers`, async () => {
        const value = pipe.transform("1,2,a,3", { type: "query" });
        await expect(value).rejects.toThrow(BadRequestException);
    });
});
