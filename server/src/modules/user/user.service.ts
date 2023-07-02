import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserByIdQuery, allUsersQuery, updateUserQuery } from "./user.queries";
import { Request, Response } from "express";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    getUsers(): Promise<User[]> {
        return this.prisma.$queryRaw(allUsersQuery);
    }

    async getUser(id: number): Promise<User> {
        const user = await this.prisma.$queryRaw<[User]>(UserByIdQuery(id));
        return user[0];
    }

    showMe(res: Response, user: User): void {
        // return { ...req.user, csrfToken: req.session.csrfToken };
        res.setHeader(
            "Set-Cookie",
            "my_cookie=kekw; Path=/; Expires=Tue, 01 Aug 2023 17:00:01 GMT; HttpOnly; Secure; SameSite=None",
        );
        // if (user) return { ...user };
        if (user) {
            res.json({ ...user });
            return;
        }
        res.send();
    }

    async updateUser(req: Request, input: UpdateUserDto): Promise<User> {
        const user = req.user;
        const data = await this.prisma.$queryRaw<[User]>(
            updateUserQuery(user.id, input),
        );

        // change session data if self update
        if (data[0]) {
            req.session.passport.user = data[0];
            req.user = data[0];
            return data[0];
        }
        return user;
    }
}
