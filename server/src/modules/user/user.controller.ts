import { Body, Controller, Get, Param, Patch, Req } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserId } from "./user.types";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    getUsers() {
        return this.userService.getUsers();
    }

    @Get(":id")
    getUserById(@Param("id") id: UserId) {
        return this.userService.getUser(id);
    }

    @Patch()
    updateCurrentUser(@Body() body: UpdateUserDto) {
        return this.userService.updateUser(body);
    }
}
