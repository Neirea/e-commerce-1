import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "sameLength", async: false })
export class SameLengthConstraint implements ValidatorConstraintInterface {
    validate(currValue: any, args: ValidationArguments): boolean {
        const [propertyName] = args.constraints;
        const propertyValue = args.object[propertyName];
        if (!propertyValue) return false;
        return propertyValue.length === currValue.length;
    }
    defaultMessage(validationArguments?: ValidationArguments): string {
        console.log(validationArguments);
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
