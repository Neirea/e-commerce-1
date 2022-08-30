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
import { failedLogin, loginCallback, logout } from "./passport";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";

export const app = express();

const startServer = async () => {
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: () => {
			return { name: "Neirea" };
		},
	});

	await server.start();
	server.applyMiddleware({ app });

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
	// dev middleware
	if (process.env.NODE_ENV !== "production") {
		const morgan = require("morgan");
		app.use(morgan("tiny"));
	}

	//session store and middleware
	const RedisStore = connectRedis(session);
	// const redisClient =
	// 	process.env.NODE_ENV === "production"
	// 		? new Redis(process.env.REDIS_URL)
	// 		: new Redis();
	const redisClient = new Redis();

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
	//google
	app.get("/auth/login/google", (req, res, next) => {
		app.set("redirect", req.query.path);
		passport.authenticate("google", {
			session: false,
			scope: ["profile", "email"],
		})(req, res, next);
	});
	app.get(
		"/auth/google/callback",
		passport.authenticate("google", {
			session: false,
			failureRedirect: "/auth/login/failed",
		}),
		loginCallback
	);
	//facebook
	app.get("/auth/login/facebook", (req, res, next) => {
		app.set("redirect", req.query.path);
		passport.authenticate("facebook", {
			session: false,
			scope: ["profile", "email"],
		})(req, res, next);
	});
	app.get(
		"/auth/facebook/callback",
		passport.authenticate("facebook", {
			session: false,
			failureRedirect: "/auth/login/failed",
		}),
		loginCallback
	);

	// not found middleware
	app.use(notFound);
	// error handling middleware

	const port = process.env.PORT || 5000;

	app.listen(port, () => {
		console.log(`Server is running on port ${port}...`);
	});
};

startServer();
