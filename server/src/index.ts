//global config
import "dotenv/config";
import "express-async-errors";
//packages
import { v2 as cloudinary } from "cloudinary";
import connectRedis from "connect-redis";
import cors from "cors";
import fileUpload, { UploadedFile } from "express-fileupload";
import express from "express";
import fs from "fs";
import session from "express-session";
import { buildCheckFunction } from "express-validator";
import helmet from "helmet";
import Redis from "ioredis";
import passport from "passport";
//user imports
import { ApolloServer } from "apollo-server-express";
import notFound from "./middleware/not-found";
import { failedLogin, loginCallback, logout } from "./passport";
import { resolvers, typeDefs } from "./schema";
import { StatusCodes } from "http-status-codes";

export const app = express();

(async () => {
	cloudinary.config({
		cloud_name: process.env.CLDNRY_NAME,
		api_key: process.env.CLDNRY_API_KEY,
		api_secret: process.env.CLDNRY_API_SECRET,
	});
	app.set("trust proxy", 1);
	app.use(helmet());
	app.use(buildCheckFunction(["body", "query", "params"])());
	app.use(fileUpload({ useTempFiles: true }));
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
		formatError: (err) => {
			// Don't give the specific errors to the client.
			if (err.message.startsWith("Database Error: ")) {
				return new Error("Internal server error");
			}

			// Otherwise return the original error. The error can also
			// be manipulated in other ways, as long as it's returned.
			return err;
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
	app.post("/editor/upload-images", async (req, res) => {
		const imageFiles = req.files?.images as UploadedFile[];
		if (!imageFiles || !imageFiles.length) {
			console.log("failed");

			res.json({ images: [] });
		}
		interface UploadedImage {
			img_id: string;
			img_src: string;
		}
		const resultImages: UploadedImage[] = [];

		for (let i = 0; i < imageFiles.length; i++) {
			const result = await cloudinary.uploader.upload(
				imageFiles[i].tempFilePath,
				{
					transformation: [
						{
							width: 640,
							height: 640,
							crop: "fill",
						},
						{
							fetch_format: "jpg",
						},
					],
					folder: "ecommerce-1",
				}
			);
			resultImages.push({
				img_id: result.public_id,
				img_src: result.secure_url,
			});
			fs.unlinkSync(imageFiles[i].tempFilePath);
		}
		res.status(StatusCodes.OK).json({ images: resultImages });
	});

	// not found middleware
	app.use(notFound);
	// error handling middleware

	const port = process.env.PORT || 5000;

	app.listen(port, () => {
		console.log(`Server is running on port ${port}...`);
	});
})();
