import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback, Profile } from "passport-google-oauth20";
import { Platform } from "@prisma/client";
import { AuthService } from "../auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
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
