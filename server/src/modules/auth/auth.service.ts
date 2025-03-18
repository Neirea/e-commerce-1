import { BadRequestException, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { Profile as GoogleProfile } from "passport-google-oauth20";
import { Profile as FacebookProfile } from "passport-facebook";
import { userByPlatformIdQuery, userCountQuery } from "./auth.queries";
import { Platform, Role, User } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { appConfig } from "src/config/env";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async validateUser(
        profile: GoogleProfile | FacebookProfile,
        platform: Platform,
    ): Promise<User> {
        const userResult = await this.prisma.$queryRaw<[User]>(
            userByPlatformIdQuery(profile.id),
        );
        let user = userResult[0];

        if (!user) {
            user = await this.registerUser(profile, platform);
        }
        return user;
    }
    private async registerUser(
        profile: GoogleProfile | FacebookProfile,
        platform: Platform,
    ): Promise<User> {
        const { id, name, photos, emails, displayName } = profile;
        const userCountResult =
            await this.prisma.$queryRaw<[{ count: number }]>(userCountQuery);
        const userCount = userCountResult[0].count;
        const isFirstAccount = userCount === 0;

        const splitName = displayName.split(" ");
        const given_name = name?.givenName || splitName[0] || "Default Name";
        const family_name = name?.familyName || splitName[1] || "";

        const userData = {
            given_name: given_name,
            family_name: family_name,
            platform_id: id,
            platform: platform,
            role: isFirstAccount ? Object.values(Role) : [Role.USER],
            address: "",
            email: emails ? emails[0].value : "",
            avatar: photos ? photos[0].value : "",
        };
        const user = await this.prisma.user.create({ data: userData });
        return user;
    }

    exitSession(req: Request, res: Response): void {
        if (req.session) {
            req.session.destroy((err) => {
                if (err) {
                    throw new BadRequestException("Failed to logout");
                }
            });
        }
        res.clearCookie("techway_sid", { domain: appConfig.serverDomain });
    }
}
