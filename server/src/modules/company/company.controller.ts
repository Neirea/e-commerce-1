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
import { CompanyId } from "./company.types";

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

    @Patch(":id")
    updateCompany(@Param("id") id: CompanyId, @Body() body: UpdateCompanyDto) {
        return this.companyService.updateCompany(id, body);
    }

    @Delete(":id")
    deleteCompany(@Param("id") id: CompanyId) {
        return this.companyService.deleteCompany(id);
    }
}
