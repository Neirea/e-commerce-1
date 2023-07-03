import {
    Controller,
    Delete,
    Get,
    Redirect,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { GoogleAuthGuard } from "./guards/google.guard";
import { FacebookAuthGuard } from "./guards/facebook.guard";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get("google/login")
    @UseGuards(GoogleAuthGuard)
    handleGoogleLogin(): void {
        return;
    }

    @Get("google/callback")
    @UseGuards(GoogleAuthGuard)
    @Redirect(process.env.CLIENT_URL, 301)
    handleGoogleCallback(): void {
        return;
    }

    @Get("facebook/login")
    @UseGuards(FacebookAuthGuard)
    handleFacebookLogin(): void {
        return;
    }

    @Get("facebook/callback")
    @UseGuards(FacebookAuthGuard)
    @Redirect(process.env.CLIENT_URL, 301)
    handleFacebookCallback(): void {
        return;
    }

    @Delete("logout")
    @UseGuards(AuthenticatedGuard)
    logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): void {
        this.authService.exitSession(req, res);
    }
}
