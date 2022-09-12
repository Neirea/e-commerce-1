import { Platform, PrismaClient, Role } from "@prisma/client";
import AuthenticationError from "./errors/authentication";
import type { Request, Response } from "express";
import passport from "passport";
import {
	Profile as FacebookProfile,
	Strategy as FacebookStrategy,
} from "passport-facebook";
import type {
	Profile as GoogleProfile,
	VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { app } from "./index";

const prisma = new PrismaClient({ log: ["query"] });
const clientUrl =
	process.env.NODE_ENV !== "production"
		? "http://localhost:3000"
		: "https://ecommerce-neirea.railway.app";

export const failedLogin = (req: Request, res: Response) => {
	res.status(401).redirect(`${clientUrl}/login?error=login_failed`);
};

export const loginCallback = (req: Request, res: Response) => {
	const redirect = app.get("redirect");
	app.set("redirect", undefined);

	if (!req.user) {
		throw new AuthenticationError("Authentication error. Something went wrong");
	}
	if (req.session) {
		req.session.user = req.user.user;
		req.session.accessToken = req.user.accessToken;
	}

	// Successful authentication, redirect to page where user specifies username
	res.redirect(`${clientUrl}/${redirect}`);
};

/* login actions */
const loginGoogle = async (
	req: Request,
	accessToken: string | undefined,
	refreshToken: string | undefined,
	profile: GoogleProfile,
	done: VerifyCallback
) => {
	const { id, name, _json } = profile;

	let user = await prisma.user.findFirst({
		where: { platform_id: id },
	});
	if (!user) {
		//update profile if different
		const isFirstAccount = (await prisma.user.count()) === 0;

		const userData = {
			given_name: name?.givenName || "",
			family_name: name?.familyName || "",
			platform_id: id,
			platform: Platform.GOOGLE,
			role: isFirstAccount ? Object.values(Role) : [Role.USER],
			address: "",
			email: _json.email!,
			avatar: _json.picture || "",
		};
		user = await prisma.user.create({ data: userData });
	}

	done(null, { user, accessToken });
};

const loginFacebook = async (
	accessToken: string | undefined,
	refreshToken: string | undefined,
	profile: FacebookProfile,
	done: VerifyCallback
) => {
	const { id, name, photos, emails } = profile;

	let user = await prisma.user.findFirst({
		where: { platform_id: id },
	});

	if (!user) {
		const isFirstAccount = (await prisma.user.count()) === 0;

		const userData = {
			given_name: name?.givenName || "",
			family_name: name?.familyName || "",
			platform: Platform.FACEBOOK,
			platform_id: id,
			role: isFirstAccount ? Role.ADMIN : Role.USER,
			address: "",
			email: emails ? emails[0].value : "",
			avatar: photos ? photos[0].value : "",
		};
		user = await prisma.user.create({ data: userData });
	}

	done(null, { user, accessToken });
};

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			callbackURL: "/auth/google/callback",
			passReqToCallback: true,
		},
		loginGoogle
	)
);
passport.use(
	new FacebookStrategy(
		{
			clientID: process.env.FACEBOOK_CLIENT_ID!,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
			callbackURL: "/auth/facebook/callback",
			profileFields: ["emails", "name", "photos"],
		},
		loginFacebook
	)
);
