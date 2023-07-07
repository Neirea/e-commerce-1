import { parseQueryString } from "./parse-querystring";

describe("parseQueryString", () => {
    it("should parse a non-empty string into the expected format", () => {
        const input = " red apple ,   orange, yellow banana     ";
        const expectedOutput = "red:*&apple:*|orange:*|yellow:*&banana:*";

        const result = parseQueryString(input);

        expect(result).toBe(expectedOutput);
    });

    it("should handle an empty string and return undefined", () => {
        const input = "";
        const expectedOutput = undefined;

        const result = parseQueryString(input);

        expect(result).toBe(expectedOutput);
    });

    it("should handle undefined input and return undefined", () => {
        const input = undefined;
        const expectedOutput = undefined;

        const result = parseQueryString(input);

        expect(result).toBe(expectedOutput);
    });

    it("should handle input with special characters and replace them", () => {
        const input = "one!,two:,three*,four<,five@,six&,seven|";
        const expectedOutput =
            "one:*|two:*|three:*|four:*|five:*|six:*|seven:*";

        const result = parseQueryString(input);

        expect(result).toBe(expectedOutput);
    });
});
