import { Controller, Get } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

@Controller()
export class AppController {
    constructor() {}
    @Get("/")
    @ApiOperation({ summary: "Health Check" })
    healthCheck(): string {
        return;
    }
}
