import {
    registerDecorator,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "sameLength", async: false })
export class SameLengthConstraint implements ValidatorConstraintInterface {
    validate(value: object, args: ValidationArguments): boolean {
        const fields = args.constraints;

        const lengths = fields.map((field: string) => value[field]?.length);
        const firstLength = lengths[0];

        return lengths.every(
            (length: number | undefined) => length === firstLength,
        );
    }
}

export function SameLength(...fields: string[]) {
    return function (object: object, propertyName: string): void {
        registerDecorator({
            name: "sameLength",
            target: object.constructor,
            propertyName: propertyName,
            options: {},
            constraints: [...fields, propertyName],
            validator: SameLengthConstraint,
        });
    };
}
