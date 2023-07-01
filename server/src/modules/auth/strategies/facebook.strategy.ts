import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-facebook";
import { Platform } from "@prisma/client";
import { AuthService } from "../auth.service";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL,
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
