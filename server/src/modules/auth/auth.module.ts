import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaService } from "../prisma/prisma.service";
import { PassportModule } from "@nestjs/passport";
import { GoogleStrategy } from "./strategies/google.strategy";
import { SessionSerializer } from "./session.serializer";
import { FacebookStrategy } from "./strategies/facebook.strategy";

@Module({
    imports: [PassportModule.register({ session: false })],
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
