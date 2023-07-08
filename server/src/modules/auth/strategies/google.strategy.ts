import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback, Profile } from "passport-google-oauth20";
import { Platform } from "@prisma/client";
import { AuthService } from "../auth.service";
import { appConfig } from "src/config/env";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
    constructor(private authService: AuthService) {
        super({
            clientID: appConfig.googleClientId,
            clientSecret: appConfig.googleClientSecret,
            callbackURL: appConfig.googleCallbackUrl,
            scope: ["profile", "email"],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback,
    ): Promise<void> {
        const user = await this.authService.validateUser(
            profile,
            Platform.GOOGLE,
        );

        done(null, user);
    }
}
