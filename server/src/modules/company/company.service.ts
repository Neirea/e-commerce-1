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
        return this.prisma.$queryRaw`${getCompaniesQuery}`;
    }

    async createCompany(input: CreateCompanyDto) {
        // if (!req.session.user?.role.includes(Role.ADMIN)) {
        //     throw new AuthenticationError(
        //         "You don't have permissions for this action"
        //     );
        // }
        await this.prisma.$queryRaw`${createCompanyQuery(input)}`;

        return true;
    }

    async updateCompany(id: CompanyId, input: UpdateCompanyDto) {
        // if (!req.session.user?.role.includes(Role.ADMIN)) {
        //     throw new AuthenticationError(
        //         "You don't have permissions for this action"
        //     );
        // }
        await this.prisma.$queryRaw`${updateCompanyQuery(id, input)}`;
        return true;
    }
    async deleteCompany(id: CompanyId) {
        // if (!req.session.user?.role.includes(Role.ADMIN)) {
        //     throw new AuthenticationError(
        //         "You don't have permissions for this action"
        //     );
        // }
        await this.prisma.$queryRaw`${deleteCompanyQuery(id)}`;
        return true;
    }
}
