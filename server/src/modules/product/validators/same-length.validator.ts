import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";
import { ISameLengthValidationArguments } from "../product.types";

@ValidatorConstraint({ name: "sameLength", async: false })
export class SameLengthConstraint implements ValidatorConstraintInterface {
    validate(currValue: string, args: ISameLengthValidationArguments): boolean {
        const [propertyName] = args.constraints;
        const propertyValue = args.object[propertyName];
        if (!propertyValue) return false;
        return propertyValue.length === currValue.length;
    }
    defaultMessage(
        validationArguments?: ISameLengthValidationArguments,
    ): string {
        if (!validationArguments) return "No validation arguments";
        const { object, property, constraints } = validationArguments;
        const property1 = property;
        const property2 = constraints[0];
        if (!object[property2]) return `${property2} does not exist`;
        return `${property1} must have the same length as ${property2}`;
    }
}

export function SameLength(
    property: string,
    validationOptions?: ValidationOptions,
) {
    return function (object: object, propertyName: string): void {
        registerDecorator({
            name: "sameLength",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: SameLengthConstraint,
        });
    };
}
