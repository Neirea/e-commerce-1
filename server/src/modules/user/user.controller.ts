import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    getUsers() {
        return this.userService.getUsers();
    }

    @Get(":id")
    getUserById(@Param("id") id: number) {
        return this.userService.getUser(id);
    }

    @Patch()
    updateCurrentUser(@Body() body: UpdateUserDto) {
        return this.userService.updateUser(body);
    }
}
