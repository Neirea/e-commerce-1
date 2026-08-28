import { Length } from "class-validator";
import type { TCompanyName } from "../company.types.js";

export class CreateCompanyDto {
    @Length(3, 30)
    name: TCompanyName;
}
