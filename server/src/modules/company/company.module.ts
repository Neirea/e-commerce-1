import { Module } from "@nestjs/common";
import { CompanyService } from "./company.service.js";
import { CompanyController } from "./company.controller.js";
import { PrismaService } from "../prisma/prisma.service.js";

@Module({
    controllers: [CompanyController],
    providers: [CompanyService, PrismaService],
})
export class CompanyModule {}
