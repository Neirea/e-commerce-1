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

(async () => {
	app.set("trust proxy", 1);
	app.use(helmet());
	app.use(buildCheckFunction(["body", "query", "params"])());
	app.use(express.json());

	//session store and middleware
	const RedisStore = connectRedis(session);
	// const redisClient =
	// 	process.env.NODE_ENV === "production"
	// 		? new Redis(process.env.REDIS_URL)
	// 		: new Redis();
	const redisClient = new Redis();

	app.use(
		session({
			name: "sid",
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

	const corsOptions = {
		origin: ["http://localhost:3000", "https://studio.apollographql.com"],
		credentials: true,
	};
	app.use(
		cors({
			origin: corsOptions.origin,
			credentials: true,
		})
	);
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: ({ req, res }) => {
			return { req, res };
		},
	});

	await server.start();
	server.applyMiddleware({ app, cors: corsOptions });

	//init passport
	app.use(passport.initialize());

	app.get("/showMe", (req, res) => {
		console.log("user=", req.session.user);

		res.json(req.session.user);
	});

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
			scope: ["email"],
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
})();
