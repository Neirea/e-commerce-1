import type { Request, Response } from "express";
import passport from "passport";
import type {
	Profile as GoogleProfile,
	VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
	Strategy as FacebookStrategy,
	Profile as FacebookProfile,
} from "passport-facebook";
import { app } from "./index";
import CustomError from "./errors";
import { PrismaClient, Role, Platform } from "@prisma/client";
//delete this later -> any
import type { IUser } from "./typings/model-types";

const prisma = new PrismaClient({ log: ["query"] });
const clientUrl =
	process.env.NODE_ENV !== "production"
		? "http://localhost:3000"
		: "https://ecommerce-neirea.railway.app";

export const randomUserName = () => {
	return "User" + (Math.floor(Math.random() * 9000) + 1000).toString();
};

export const failedLogin = (req: Request, res: Response) => {
	res.status(401).redirect(`${clientUrl}/login?error=login_failed`);
};

export const logout = (req: Request, res: Response) => {
	if (req.session) {
		//deletes from session from mongoDB too
		req.session.destroy((err) => {
			if (err) {
				res.status(400).send("Unable to log out");
			}
		});
	}
	res.clearCookie("sid");
	res.status(200).json({ msg: "Log out" });
};

export const loginCallback = (req: Request, res: Response) => {
	const redirect = app.get("redirect");
	app.set("redirect", undefined);

	if (!req.user) {
		throw new CustomError.BadRequestError("Authentication error. User error!");
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
	let user = await prisma.user.findFirst({
		where: { email: profile._json.email },
	});
	const { name, displayName, _json } = profile;
	if (user) {
		//update profile if different
		if (
			(_json.picture && user.avatar !== _json.picture) ||
			(name && user.platform !== name.givenName) ||
			(displayName && user.name !== displayName)
		) {
			user = await prisma.user.update({
				where: { id: user.id },
				data: {
					avatar: _json.picture,
					name: name?.givenName,
					username: displayName,
				},
			});
		}
	} else {
		const isFirstAccount = (await prisma.user.count()) === 0;

		const userData = {
			name: name?.givenName || randomUserName(),
			username: displayName,
			platform: Platform.GOOGLE,
			role: isFirstAccount ? Role.ADMIN : Role.USER,
			email: _json.email!,
			avatar: _json.picture,
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
	let user = (await prisma.user.findFirst({
		where: { email: profile._json.email },
	})) as IUser;

	console.log(profile);

	// const { name, displayName, _json } = profile;
	// if (user) {
	// 	//update profile if different
	// 	if (
	// 		(_json.picture && user.avatar !== _json.picture) ||
	// 		(name && user.platform !== name.givenName) ||
	// 		(displayName && user.name !== displayName)
	// 	) {
	// 		user = await prisma.user.update({
	// 			where: { id: user.id },
	// 			data: {
	// 				avatar: _json.picture,
	// 				name: name?.givenName,
	// 				username: displayName,
	// 			},
	// 		});
	// 	}
	// } else {
	// 	const isFirstAccount = (await prisma.user.count()) === 0;

	// 	const userData = {
	// 		name: name?.givenName || randomUserName(),
	// 		username: displayName,
	// 		platform: Platform.GOOGLE,
	// 		role: isFirstAccount ? Role.ADMIN : Role.USER,
	// 		email: _json.email!,
	// 		avatar: _json.picture,
	// 	};
	// 	user = await prisma.user.create({ data: userData });
	// }

	done(null, { user, accessToken });
};

//google
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
		},
		loginFacebook
	)
);
