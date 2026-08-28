import { Module } from "@nestjs/common";
import { UserService } from "./user.service.js";
import { UserController } from "./user.controller.js";
import { PrismaService } from "../prisma/prisma.service.js";

@Module({
    controllers: [UserController],
    providers: [UserService, PrismaService],
})
export class UserModule {}
