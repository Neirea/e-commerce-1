import {
    Controller,
    Delete,
    Get,
    HttpCode,
    Redirect,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthenticatedGuard } from "./guards/authenticated.guard";
import { Request, Response } from "express";
import { ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { GoogleAuthGuard } from "./guards/google.guard";
import { FacebookAuthGuard } from "./guards/facebook.guard";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get("google/login")
    @ApiOperation({ description: "Performs OAuth2 login via Google" })
    @UseGuards(GoogleAuthGuard)
    handleGoogleLogin(): void {
        return;
    }

    @Get("google/callback")
    @HttpCode(301)
    @ApiOperation({ description: "Redirecting user to client url after login" })
    @UseGuards(GoogleAuthGuard)
    @Redirect(process.env.CLIENT_URL, 301)
    handleGoogleCallback(): void {
        return;
    }

    @Get("facebook/login")
    @ApiOperation({ description: "Performs OAuth2 login via Facebook" })
    @UseGuards(FacebookAuthGuard)
    handleFacebookLogin(): void {
        return;
    }

    @Get("facebook/callback")
    @HttpCode(301)
    @ApiOperation({ description: "Redirecting user to client url after login" })
    @UseGuards(FacebookAuthGuard)
    @Redirect(process.env.CLIENT_URL, 301)
    handleFacebookCallback(): void {
        return;
    }

    @Delete("logout")
    @HttpCode(204)
    @ApiCookieAuth()
    @UseGuards(AuthenticatedGuard)
    logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): void {
        this.authService.exitSession(req, res);
    }
}
