//global config
import "express-async-errors";
import "dotenv/config";
//packages
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import { buildCheckFunction } from "express-validator";
import helmet from "helmet";
import Redis from "ioredis";
import passport from "passport";
//user imports
import notFound from "./middleware/not-found";
import { failedLogin, googleCallback, logout } from "./passport";

const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(
	cors({
		origin:
			process.env.NODE_ENV !== "production"
				? "http://localhost:3000"
				: "https://www.neirea.com",
		credentials: true,
	})
);
app.use(express.json());
app.use(buildCheckFunction(["body", "query", "params"])());
//dev middleware
if (process.env.NODE_ENV !== "production") {
	const morgan = require("morgan");
	app.use(morgan("tiny"));
}

//session store and middleware
const RedisStore = connectRedis(session);
const redisClient =
	process.env.NODE_ENV === "production"
		? new Redis(process.env.REDIS_URL)
		: new Redis();

app.use(
	session({
		store: new RedisStore({ client: redisClient }),
		saveUninitialized: false,
		secret: process.env.SESSION_SECRET!,
		resave: false,
		cookie: {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 1000 * 60 * 60 * 24 * 30, //30 days
		},
	})
);

//init passport
app.use(passport.initialize());

//auth routes
app.delete("/auth/logout", logout);
app.get("/auth/login/failed", failedLogin);
app.get("/auth/login/google", (req, res, next) => {
	app.set("redirect", req.query.path);
	passport.authenticate("google", {
		session: false,
		scope: ["profile", "email"],
	})(req, res, next);
});

app.get(
	"/oauth/google",
	passport.authenticate("google", {
		session: false,
		failureRedirect: "/auth/login/failed",
	}),
	googleCallback
);

// not found middleware
app.use(notFound);
// error handling middleware

export default app;
