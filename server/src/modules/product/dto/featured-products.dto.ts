import { Transform, TransformFnParams } from "class-transformer";
import { IsOptional } from "class-validator";

export class FeaturedProductsDto {
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    limit: number;
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    offset: number;
}
