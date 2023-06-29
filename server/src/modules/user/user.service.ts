import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserByIdQuery, allUsersQuery, updateUserQuery } from "./user.queries";
import { Request } from "express";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    getUsers() {
        // if (!req.session.user?.role.includes(Role.ADMIN)) {
        //     throw new AuthenticationError(
        //         "You don't have permissions for this action"
        //     );
        // }
        return this.prisma.$queryRaw(allUsersQuery);
    }

    async getUser(id: number) {
        // if (!req.session.user?.role.includes(Role.ADMIN)) {
        //     throw new AuthenticationError(
        //         "You don't have permissions for this action"
        //     );
        // }
        const user = await this.prisma.$queryRaw<[User]>(UserByIdQuery(id));
        return user[0];
    }

    showMe(req: Request) {
        if (!req.session.passport.user) {
            return undefined;
        }
        // return { ...req.session.passport.user, csrfToken: req.session.csrfToken };
        return { ...req.session.passport.user };
    }

    async updateUser(req: Request, input: UpdateUserDto) {
        const user = req.session.passport.user;
        const data = await this.prisma.$queryRaw<[User]>(
            updateUserQuery(user.id, input),
        );

        // change session data if self update
        if (data[0]) {
            req.session.passport.user = data[0];
            return true;
        }
        return false;
    }
}
