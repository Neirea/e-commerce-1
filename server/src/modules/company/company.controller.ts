import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from "@nestjs/common";
import { CompanyService } from "./company.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { CompanyId, CompanyWithCategories } from "./company.types";
import { Role } from "@prisma/client";
import { RolesGuard } from "src/common/roles/roles.guard";
import { Roles } from "src/common/roles/roles.decorator";

@Controller("company")
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @Get()
    getCompanies(): Promise<CompanyWithCategories[]> {
        return this.companyService.getCompanies();
    }

    @Post()
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    createCompany(@Body() body: CreateCompanyDto): Promise<void> {
        return this.companyService.createCompany(body);
    }

    @Patch(":id")
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    updateCompany(
        @Param("id") id: CompanyId,
        @Body() body: UpdateCompanyDto,
    ): Promise<void> {
        return this.companyService.updateCompany(id, body);
    }

    @Delete(":id")
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    deleteCompany(@Param("id") id: CompanyId): Promise<void> {
        return this.companyService.deleteCompany(id);
    }
}
