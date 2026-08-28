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
import { CompanyService } from "./company.service.js";
import { CreateCompanyDto } from "./dto/create-company.dto.js";
import { UpdateCompanyDto } from "./dto/update-company.dto.js";
import type { TCompanyId } from "./company.types.js";
import { Role } from "../../database/generated/client.js";
import { RolesGuard } from "../../common/roles/roles.guard.js";
import { Roles } from "../../common/roles/roles.decorator.js";
import { ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CompanyWithCategoriesDto } from "./dto/get-companies.dto.js";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard.js";

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
    async createCompany(@Body() body: CreateCompanyDto): Promise<void> {
        await this.companyService.createCompany(body);
    }

    @Patch(":id")
    @HttpCode(204)
    @ApiOperation({ summary: "Updates specific company" })
    @ApiCookieAuth()
    @UseGuards(AuthenticatedGuard)
    @Roles(Role.EDITOR)
    @UseGuards(RolesGuard)
    async updateCompany(
        @Param("id") id: TCompanyId,
        @Body() body: UpdateCompanyDto,
    ): Promise<void> {
        await this.companyService.updateCompany(id, body);
    }

    @Delete(":id")
    @HttpCode(204)
    @ApiOperation({ summary: "Deletes specific company" })
    @ApiCookieAuth()
    @UseGuards(AuthenticatedGuard)
    @Roles(Role.EDITOR)
    @UseGuards(RolesGuard)
    async deleteCompany(@Param("id") id: TCompanyId): Promise<void> {
        await this.companyService.deleteCompany(id);
    }
}
