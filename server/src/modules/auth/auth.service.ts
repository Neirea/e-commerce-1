import { BadRequestException, Injectable } from "@nestjs/common";
// import { UsersService } from "../users/users.service";
// import { comparePassword } from "src/utils/password";
// import CustomRequest from "src/interfaces/custom-requests.interface";
import { Request, Response } from "express";
import { Profile as GoogleProfile } from "passport-google-oauth20";
import { Profile as FacebookProfile } from "passport-facebook";
import { userByPlatformIdQuery, userCountQuery } from "./auth.queries";
import { Platform, Role, User } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

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
        const userCountResult = await this.prisma.$queryRaw(userCountQuery);
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

    async exitSession(req: Request, res: Response): Promise<void> {
        if (req.session) {
            //deletes from session from Redis too
            req.session.destroy((err: any) => {
                if (err) {
                    throw new BadRequestException("Failed to logout");
                }
            });
        }
        res.clearCookie("sid", {
            sameSite:
                process.env.NODE_ENV === "production" ? "none" : undefined,
            secure: process.env.NODE_ENV === "production",
        });
        res.status(200).json({ logout: true });
    }
}
