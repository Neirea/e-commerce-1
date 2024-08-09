import { Length } from "class-validator";
import { TCompanyName } from "../company.types";

export class CreateCompanyDto {
    @Length(3, 30)
    name: TCompanyName;
}
