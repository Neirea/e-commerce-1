import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
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
import { ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CompanyWithCategoriesDto } from "./dto/get-companies.dto";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";

@ApiTags("company")
@Controller("company")
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @Get()
    @ApiOperation({ summary: "Retrieves all companies with their categories" })
    getCompanies(): Promise<CompanyWithCategoriesDto[]> {
        return this.companyService.getCompanies();
    }

    @Post()
    @ApiOperation({ summary: "Creates company" })
    @ApiCookieAuth()
    @UseGuards(AuthenticatedGuard)
    @Roles(Role.EDITOR)
    @UseGuards(RolesGuard)
    createCompany(@Body() body: CreateCompanyDto): void {
        this.companyService.createCompany(body);
    }

    @Patch(":id")
    @HttpCode(204)
    @ApiOperation({ summary: "Updates specific company" })
    @ApiCookieAuth()
    @UseGuards(AuthenticatedGuard)
    @Roles(Role.EDITOR)
    @UseGuards(RolesGuard)
    updateCompany(
        @Param("id") id: CompanyId,
        @Body() body: UpdateCompanyDto,
    ): void {
        this.companyService.updateCompany(id, body);
    }

    @Delete(":id")
    @HttpCode(204)
    @ApiOperation({ summary: "Deletes specific company" })
    @ApiCookieAuth()
    @UseGuards(AuthenticatedGuard)
    @Roles(Role.EDITOR)
    @UseGuards(RolesGuard)
    deleteCompany(@Param("id") id: CompanyId): void {
        this.companyService.deleteCompany(id);
    }
}
