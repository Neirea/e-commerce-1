import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Platform } from "src/database/generated/client";
import { Profile, Strategy } from "passport-facebook";
import { VerifyCallback } from "passport-google-oauth20";
import { appConfig } from "src/config/env";
import { AuthService } from "../auth.service";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
    constructor(private authService: AuthService) {
        super({
            clientID: appConfig.facebookClientId,
            clientSecret: appConfig.facebookClientSecret,
            callbackURL: appConfig.facebookCallbackUrl,
            scope: ["public_profile", "email"],
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
            Platform.FACEBOOK,
        );

        done(null, user);
    }
}
