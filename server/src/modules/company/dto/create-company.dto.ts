import { Length } from "class-validator";
import { CompanyName } from "../company.types";

export class CreateCompanyDto {
    @Length(3, 20)
    name: CompanyName;
}
