import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Req,
    UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Request } from "express";
import { UserId } from "./user.types";
import { RolesGuard } from "src/common/roles/roles.guard";
import { Role, User } from "@prisma/client";
import { Roles } from "src/common/roles/roles.decorator";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    getUsers(): Promise<User[]> {
        return this.userService.getUsers();
    }

    @Get("me")
    showMe(@Req() req: Request): User {
        return this.userService.showMe(req);
    }

    @Get(":id")
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    getUserById(@Param("id") id: UserId): Promise<User> {
        return this.userService.getUser(id);
    }

    @Patch()
    @UseGuards(AuthenticatedGuard)
    updateCurrentUser(
        @Req() req: Request,
        @Body() body: UpdateUserDto,
    ): Promise<User> {
        return this.userService.updateUser(req, body);
    }
}
