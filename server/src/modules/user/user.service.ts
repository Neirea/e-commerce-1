import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserByIdQuery, allUsersQuery, updateUserQuery } from "./user.queries";
import { Request } from "express";
import { User } from "./entities/user.entity";

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

    showMe(user: User | undefined): User | undefined {
        if (user) return { ...user };
    }

    async updateUser(req: Request, input: UpdateUserDto): Promise<User> {
        const user = req.user!;
        const data = await this.prisma.$queryRaw<[User]>(
            updateUserQuery(user.id, input),
        );

        if (data[0] && req.session.passport) {
            req.session.passport.user = data[0];
            return data[0];
        }
        return user;
    }
}
