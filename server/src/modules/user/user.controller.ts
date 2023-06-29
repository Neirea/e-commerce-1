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
import { Role } from "@prisma/client";
import { Roles } from "src/common/roles/roles.decorator";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    getUsers() {
        return this.userService.getUsers();
    }

    @Get("me")
    @UseGuards(AuthenticatedGuard)
    showMe(@Req() req: Request) {
        return this.userService.showMe(req);
    }

    @Get(":id")
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    getUserById(@Param("id") id: UserId) {
        return this.userService.getUser(id);
    }

    @Patch()
    @UseGuards(AuthenticatedGuard)
    updateCurrentUser(@Req() req: Request, @Body() body: UpdateUserDto) {
        return this.userService.updateUser(req, body);
    }
}
