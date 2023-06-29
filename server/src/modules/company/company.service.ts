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
import { CompanyId } from "./company.types";

@Injectable()
export class CompanyService {
    constructor(private prisma: PrismaService) {}

    getCompanies() {
        return this.prisma.$queryRaw(getCompaniesQuery);
    }

    async createCompany(input: CreateCompanyDto) {
        await this.prisma.$queryRaw(createCompanyQuery(input));
        return true;
    }

    async updateCompany(id: CompanyId, input: UpdateCompanyDto) {
        await this.prisma.$queryRaw(updateCompanyQuery(id, input));
        return true;
    }
    async deleteCompany(id: CompanyId) {
        await this.prisma.$queryRaw(deleteCompanyQuery(id));
        return true;
    }
}
