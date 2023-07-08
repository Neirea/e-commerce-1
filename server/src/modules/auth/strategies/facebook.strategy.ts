import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-facebook";
import { Platform } from "@prisma/client";
import { AuthService } from "../auth.service";
import { appConfig } from "src/config/env";

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
        done: any,
    ): Promise<void> {
        const user = await this.authService.validateUser(
            profile,
            Platform.FACEBOOK,
        );

        done(null, user);
    }
}
