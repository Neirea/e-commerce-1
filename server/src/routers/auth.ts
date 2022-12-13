import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import passport from "passport";
import { app } from "..";
import { failedLogin, loginCallback } from "../passport";

const router = Router();

//auth routes
router.get("/login/failed", failedLogin);
//google
router.get("/login/google", (req, res, next) => {
    app.set("redirect", req.query.path);
    passport.authenticate("google", {
        session: false,
        scope: ["profile", "email"],
    })(req, res, next);
});
router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/login/failed",
    }),
    loginCallback
);
//facebook
router.get("/login/facebook", (req, res, next) => {
    app.set("redirect", req.query.path);
    passport.authenticate("facebook", {
        session: false,
        scope: ["email"],
    })(req, res, next);
});
router.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
        session: false,
        failureRedirect: "/login/failed",
    }),
    loginCallback
);
router.delete("/logout", (req, res) => {
    if (req.session) {
        //deletes from session from Redis too
        req.session.destroy((err: any) => {
            if (err) {
                return false;
            }
        });
    }

    res.clearCookie("sid", {
        sameSite: process.env.NODE_ENV === "production" ? "none" : undefined,
        secure: process.env.NODE_ENV === "production",
    });

    res.status(StatusCodes.OK).json({ message: "Success" });
});

export default router;
