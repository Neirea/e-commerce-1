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
import { GoogleAuthGuard } from "./guards/google.guard";
import { FacebookAuthGuard } from "./guards/facebook.guard";
import { AuthenticatedGuard } from "./guards/authenticated.guard";
import { Request, Response } from "express";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get("google/login")
    @UseGuards(GoogleAuthGuard)
    handleGoogleLogin() {
        return { msg: "Google Auth" };
    }

    @Get("google/callback")
    @UseGuards(GoogleAuthGuard)
    @Redirect(process.env.CLIENT_URL, 301)
    handleGoogleCallback() {
        return { msg: "Success" };
    }

    @Get("facebook/login")
    @UseGuards(FacebookAuthGuard)
    handleFacebookLogin() {
        return { msg: "Google Auth" };
    }

    @Get("facebook/callback")
    @UseGuards(FacebookAuthGuard)
    handleFacebookCallback() {
        return { msg: "Callback" };
    }

    @Delete("logout")
    @UseGuards(AuthenticatedGuard)
    logout(@Req() req: Request, @Res() res: Response) {
        this.authService.exitSession(req, res);
    }
}
