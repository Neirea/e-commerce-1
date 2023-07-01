import { Transform, TransformFnParams } from "class-transformer";
import { IsNumber } from "class-validator";

export class FeaturedProductsDto {
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsNumber()
    limit: number;
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsNumber()
    offset: number;
}
