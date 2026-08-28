import {
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    Patch,
    Req,
    UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";
import { type Request } from "express";
import type { TUserId } from "./user.types.js";
import { RolesGuard } from "../../common/roles/roles.guard.js";
import { Role } from "../../database/generated/client.js";
import { Roles } from "../../common/roles/roles.decorator.js";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard.js";
import { ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { User } from "./entities/user.entity.js";

@ApiTags("user")
@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @ApiOperation({ summary: "Retrieves list of all users" })
    @ApiCookieAuth()
    @UseGuards(AuthenticatedGuard)
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    getUsers(): Promise<User[]> {
        return this.userService.getUsers();
    }

    @Get("me")
    @ApiOperation({ summary: "Gets current user if logged in" })
    showMe(@Req() req: Request): User | undefined {
        const user = req.user;
        return this.userService.showMe(user);
    }

    @Get(":id")
    @ApiOperation({ summary: "Retrieves specific user" })
    @ApiCookieAuth()
    @UseGuards(AuthenticatedGuard)
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    getUserById(@Param("id") id: TUserId): Promise<User> {
        return this.userService.getUser(id);
    }

    @Patch("me")
    @HttpCode(200)
    @ApiOperation({ summary: "Updates current user's profile" })
    @ApiCookieAuth()
    @UseGuards(AuthenticatedGuard)
    updateCurrentUser(
        @Req() req: Request,
        @Body() body: UpdateUserDto,
    ): Promise<User> {
        return this.userService.updateUser(req, body);
    }
}
