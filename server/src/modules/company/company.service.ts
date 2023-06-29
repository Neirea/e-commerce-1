import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import {
    createCompanyQuery,
    deleteCompanyQuery,
    getCompaniesQuery,
    updateCompanyQuery,
} from "./company.queries";
import { CompanyId, CompanyWithCategories } from "./company.types";

@Injectable()
export class CompanyService {
    constructor(private prisma: PrismaService) {}

    getCompanies(): Promise<CompanyWithCategories[]> {
        return this.prisma.$queryRaw<CompanyWithCategories[]>(
            getCompaniesQuery,
        );
    }

    async createCompany(input: CreateCompanyDto): Promise<void> {
        await this.prisma.$queryRaw(createCompanyQuery(input));
    }

    async updateCompany(id: CompanyId, input: UpdateCompanyDto): Promise<void> {
        await this.prisma.$queryRaw(updateCompanyQuery(id, input));
    }
    async deleteCompany(id: CompanyId): Promise<void> {
        await this.prisma.$queryRaw(deleteCompanyQuery(id));
    }
}
