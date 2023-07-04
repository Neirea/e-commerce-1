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
        return propertyValue.length === currValue.length;
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
