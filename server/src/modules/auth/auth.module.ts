import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { PassportModule } from "@nestjs/passport";
import { GoogleStrategy } from "./strategies/google.strategy.js";
import { SessionSerializer } from "./session.serializer.js";
import { FacebookStrategy } from "./strategies/facebook.strategy.js";

@Module({
    imports: [PassportModule.register({ session: true })],
    controllers: [AuthController],
    providers: [
        AuthService,
        GoogleStrategy,
        FacebookStrategy,
        SessionSerializer,
        PrismaService,
    ],
})
export class AuthModule {}
