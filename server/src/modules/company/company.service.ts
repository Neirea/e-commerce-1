import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateCompanyDto } from "./dto/create-company.dto.js";
import { UpdateCompanyDto } from "./dto/update-company.dto.js";
import {
    createCompanyQuery,
    deleteCompanyQuery,
    getCompaniesQuery,
    updateCompanyQuery,
} from "./company.queries.js";
import { TCompanyId } from "./company.types.js";
import { CompanyWithCategoriesDto } from "./dto/get-companies.dto.js";

@Injectable()
export class CompanyService {
    constructor(private prisma: PrismaService) {}

    getCompanies(): Promise<CompanyWithCategoriesDto[]> {
        return this.prisma.$queryRaw<CompanyWithCategoriesDto[]>(
            getCompaniesQuery,
        );
    }

    async createCompany(input: CreateCompanyDto): Promise<void> {
        await this.prisma.$queryRaw(createCompanyQuery(input));
    }

    async updateCompany(
        id: TCompanyId,
        input: UpdateCompanyDto,
    ): Promise<void> {
        await this.prisma.$queryRaw(updateCompanyQuery(id, input));
    }
    async deleteCompany(id: TCompanyId): Promise<void> {
        await this.prisma.$queryRaw(deleteCompanyQuery(id));
    }
}
