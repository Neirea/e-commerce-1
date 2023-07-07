import { validate } from "class-validator";
import { SameLength } from "./same-length.validator";

class TestClass {
    property: string[];
    @SameLength("property")
    otherProperty: string[];
}

class TestFailClass {
    property: string[];
    @SameLength("prop")
    otherProperty: string[];
}

describe("SameLengthConstraint", () => {
    it("should pass validation when lengths are the same", async () => {
        const instance = new TestClass();
        instance.property = ["hello", "world"];
        instance.otherProperty = ["test", "app"];

        const errors = await validate(instance);

        expect(errors.length).toBe(0);
    });

    it("should fail validation when lengths are different", async () => {
        const instance = new TestClass();
        instance.property = ["hello", "world"];
        instance.otherProperty = ["test"];

        const errors = await validate(instance);

        expect(errors.length).toBe(1);
        expect(errors[0].constraints).toEqual({
            sameLength: "otherProperty must have the same length as property",
        });
    });

    it("should fail validation when incorrect prop is specified", async () => {
        const instance = new TestFailClass();
        instance.property = ["hello", "world"];
        instance.otherProperty = ["test"];

        const errors = await validate(instance);
        expect(errors.length).toBe(1);
        expect(errors[0].constraints).toEqual({
            sameLength: "prop does not exist",
        });
    });
});
