//global config
import "dotenv/config";
import "express-async-errors";
//packages
import { v2 as cloudinary } from "cloudinary";
import connectRedis from "connect-redis";
import cors from "cors";
import fileUpload, { UploadedFile } from "express-fileupload";
import express, { Request } from "express";
import fs from "fs";
import session from "express-session";
import { buildCheckFunction } from "express-validator";
import helmet from "helmet";
import Redis from "ioredis";
import passport from "passport";
//user imports
import { ApolloServer } from "apollo-server-express";
import notFound from "./middleware/not-found";
import { failedLogin, loginCallback } from "./passport";
import { resolvers, typeDefs } from "./schema";
import { StatusCodes } from "http-status-codes";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

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
		plugins: [
			{
				async requestDidStart(initialRequestContext) {
					return {
						async didEncounterErrors({ errors }) {
							const { operationName, context } = initialRequestContext;
							if (
								operationName === "CreateProduct" ||
								operationName === "UpdateProduct" ||
								operationName === "CreateCategory" ||
								operationName === "UpdateCategory"
							) {
								context.input.img_id.forEach((id: string) =>
									cloudinary.uploader.destroy(id)
								);
								const image = context.req.files?.image as
									| UploadedFile
									| undefined;
								if (image) fs.unlinkSync(image.tempFilePath);
							}
						},
					};
				},
			},
		],
		formatError: (err) => {
			console.log("Log error message:", err.message);

			// Don't show DB Errors to user
			if (err.originalError instanceof PrismaClientKnownRequestError) {
				return new Error("Internal server error");
			}
			return err;
		},
	});

	await server.start();
	server.applyMiddleware({ app, cors: corsOptions });

	//init passport
	app.use(passport.initialize());

	//REST API Routes
	require("./restAPI");

	// not found middleware
	app.use(notFound);

	const port = process.env.PORT || 5000;

	app.listen(port, () => {
		console.log(`Server is running on port ${port}...`);
	});
})();
