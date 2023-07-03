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
import { CompanyId } from "./company.types";
import { Role } from "@prisma/client";
import { RolesGuard } from "src/common/roles/roles.guard";
import { Roles } from "src/common/roles/roles.decorator";
import { ApiCookieAuth, ApiTags } from "@nestjs/swagger";
import { CompanyWithCategoriesDto } from "./dto/get-companies.dto";

@ApiTags("company")
@Controller("company")
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @Get()
    getCompanies(): Promise<CompanyWithCategoriesDto[]> {
        return this.companyService.getCompanies();
    }

    @Post()
    @ApiCookieAuth()
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    createCompany(@Body() body: CreateCompanyDto): void {
        this.companyService.createCompany(body);
    }

    @Patch(":id")
    @Roles(Role.ADMIN)
    @ApiCookieAuth()
    @UseGuards(RolesGuard)
    updateCompany(
        @Param("id") id: CompanyId,
        @Body() body: UpdateCompanyDto,
    ): void {
        this.companyService.updateCompany(id, body);
    }

    @Delete(":id")
    @Roles(Role.ADMIN)
    @ApiCookieAuth()
    @UseGuards(RolesGuard)
    deleteCompany(@Param("id") id: CompanyId): void {
        this.companyService.deleteCompany(id);
    }
}
