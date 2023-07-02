import { Controller, Delete, Get, Req, Res, UseGuards } from "@nestjs/common";
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
    handleGoogleLogin(): { msg: string } {
        return { msg: "Google Auth" };
    }

    @Get("google/callback")
    @UseGuards(GoogleAuthGuard)
    handleGoogleCallback(@Res() res: Response): void {
        res.redirect(301, process.env.CLIENT_URL);
    }

    @Get("facebook/login")
    @UseGuards(FacebookAuthGuard)
    handleFacebookLogin(): { msg: string } {
        return { msg: "Google Auth" };
    }

    @Get("facebook/callback")
    @UseGuards(FacebookAuthGuard)
    handleFacebookCallback(@Res() res: Response): void {
        res.redirect(301, process.env.CLIENT_URL);
    }

    @Delete("logout")
    @UseGuards(AuthenticatedGuard)
    logout(@Req() req: Request, @Res() res: Response): void {
        this.authService.exitSession(req, res);
    }
}
