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
    handleGoogleLogin(): { msg: string } {
        return { msg: "Google Auth" };
    }

    @Get("google/callback")
    @UseGuards(GoogleAuthGuard)
    @Redirect(process.env.CLIENT_URL, 301)
    handleGoogleCallback(@Req() req: Request): { msg: string } {
        console.log("session=", req.session);
        return { msg: "Success" };
    }

    @Get("facebook/login")
    @UseGuards(FacebookAuthGuard)
    @Redirect(process.env.CLIENT_URL, 301)
    handleFacebookLogin(): { msg: string } {
        return { msg: "Google Auth" };
    }

    @Get("facebook/callback")
    @UseGuards(FacebookAuthGuard)
    handleFacebookCallback(): { msg: string } {
        return { msg: "Callback" };
    }

    @Delete("logout")
    @UseGuards(AuthenticatedGuard)
    logout(@Req() req: Request, @Res() res: Response): void {
        this.authService.exitSession(req, res);
    }
}
