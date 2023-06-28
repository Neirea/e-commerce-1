import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";
import { UpdateUserDto } from "./dto/update-user.dto";
import { updateUserQuery } from "./user.queries";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    getUsers() {
        // if (!req.session.user?.role.includes(Role.ADMIN)) {
        //     throw new AuthenticationError(
        //         "You don't have permissions for this action"
        //     );
        // }
        return this.prisma.$queryRaw`
            SELECT * FROM public."User";
        `;
    }

    async getUser(id: number) {
        // if (!req.session.user?.role.includes(Role.ADMIN)) {
        //     throw new AuthenticationError(
        //         "You don't have permissions for this action"
        //     );
        // }
        const user = await this.prisma.$queryRaw<[User]>`
            SELECT * FROM public."User"
            WHERE id = ${id}
        `;
        return user[0];
    }

    showMe() {
        // if (!req.session.user) {
        //     return undefined;
        // }
        // return { ...req.session.user, csrfToken: req.session.csrfToken };
    }

    async updateUser(input: UpdateUserDto) {
        // const { id, given_name, family_name, email, address, phone } = input;

        // check if id === req.session.user.id

        // if (given_name.length < 2 || family_name.length < 2) {
        //     throw new UserInputError("Name is too short");
        // }
        // if (email && !email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
        //     throw new UserInputError("Bad email format");
        // }
        const data = await this.prisma.$queryRaw<[User]>`${updateUserQuery(
            input,
        )}`;

        // why this? any
        // if (data[0]) {
        //     req.session.user = data[0];
        //     return true;
        // }
        return false;
    }
}
