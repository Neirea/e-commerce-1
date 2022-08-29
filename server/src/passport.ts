import type { Request, Response } from "express";
import passport from "passport";
import type {
	Profile as GoogleProfile,
	VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import app from "./app";
import CustomError from "./errors";
import { platformEnum, userRoles } from "./typings/model-types";

const clientUrl =
	process.env.NODE_ENV !== "production"
		? "http://localhost:3000"
		: "https://ecommerce-neirea.railway.app";

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

export const googleCallback = (req: Request, res: Response) => {
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

export const randomUserName = () => {
	return "User" + (Math.floor(Math.random() * 9000) + 1000).toString();
};

/* login actions */
export async function loginGoogle(
	req: Request,
	accessToken: string | undefined,
	refreshToken: string | undefined,
	profile: GoogleProfile,
	done: VerifyCallback
) {
	let user = await User.findOne({
		platform_id: profile.id,
		platform_type: platformEnum.google,
	});
	const { id, name, displayName, _json } = profile;

	if (user) {
		//update profile if different
		let changed = false;
		if (_json.picture && user.avatar_url !== _json.picture) {
			user.avatar_url = _json.picture;
			changed = true;
		}
		if (name && user.platform_name !== name.givenName) {
			user.platform_name = name.givenName;
			changed = true;
		}
		if (displayName && user.name !== displayName) {
			user.name = displayName;
			changed = true;
		}
		changed && user.save();
	} else {
		const isFirstAccount = (await User.countDocuments({})) === 0;
		user = await User.create({
			platform_id: id,
			platform_name: name?.givenName || randomUserName(),
			platform_type: platformEnum.google,
			name: displayName || randomUserName(),
			roles: isFirstAccount ? Object.values(userRoles) : [userRoles.user],
			avatar_url: _json.picture,
		});
	}
	user = user.toObject();
	done(null, { user, accessToken });
}

//google
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			callbackURL: "/oauth/google/callback",
			passReqToCallback: true,
		},
		loginGoogle
	)
);
