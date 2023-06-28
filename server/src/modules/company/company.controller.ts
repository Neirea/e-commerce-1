import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from "@nestjs/common";
import { CompanyService } from "./company.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";

@Controller("company")
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @Get()
    getCompanies() {
        return this.companyService.getCompanies();
    }

    @Post()
    createCompany(@Body() body: CreateCompanyDto) {
        return this.companyService.createCompany(body);
    }

    @Patch()
    updateCompany(@Body() body: UpdateCompanyDto) {
        return this.companyService.updateCompany(body);
    }

    @Delete(":id")
    deleteCompany(@Param("id") id: number) {
        return this.companyService.deleteCompany(id);
    }
}
