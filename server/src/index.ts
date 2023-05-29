//global config
import "dotenv/config";
import "express-async-errors";
//packages
import { Prisma } from "@prisma/client";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { unwrapResolverError } from "@apollo/server/errors";
import { v2 as cloudinary } from "cloudinary";
import connectRedis from "connect-redis";
import cors from "cors";
import express, { Request, Response } from "express";
import fileUpload from "express-fileupload";
import session from "express-session";
import { buildCheckFunction } from "express-validator";
import helmet from "helmet";
import Redis from "ioredis";
import passport from "passport";
import Stripe from "stripe";
//user imports
import errorHandlerMiddleware from "./middleware/error-handle";
import notFound from "./middleware/not-found";
import authRouter from "./routers/auth";
import editorRouter from "./routers/editor";
import paymentRouter from "./routers/payment";
import { resolvers, typeDefs } from "./schema";
import { Session } from "inspector";
import logger from "./logger";

export const app = express();

export const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!, {
    apiVersion: "2022-11-15",
});

(async () => {
    cloudinary.config({
        cloud_name: process.env.CLDNRY_NAME,
        api_key: process.env.CLDNRY_API_KEY,
        api_secret: process.env.CLDNRY_API_SECRET,
    });
    app.set("trust proxy", true);
    app.use(helmet());
    app.use(buildCheckFunction(["body", "query", "params"])());
    app.use(fileUpload({ useTempFiles: true }));
    app.use((req, res, next) => {
        if (req.originalUrl == "/api/payment/webhook") {
            next();
        } else {
            express.json()(req, res, next);
        }
    });

    //session store and middleware
    const RedisStore = connectRedis(session);
    const redisClient = new Redis(process.env.REDIS_URL!);
    const redisStore = new RedisStore({
        client: redisClient,
    });

    app.use(
        session({
            name: "sid",
            store: redisStore,
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET!,
            resave: false,
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 1000 * 60 * 60 * 24 * 30, //30 days
                sameSite:
                    process.env.NODE_ENV === "production" ? "none" : undefined,
            },
        })
    );

    interface GQLContext {
        req: Request;
        res: Response;
    }
    const server = new ApolloServer<GQLContext>({
        typeDefs,
        resolvers,
        plugins: [
            {
                async requestDidStart(initialRequestContext) {
                    return {
                        async didEncounterErrors({ errors }) {
                            const vars =
                                initialRequestContext.request.variables;

                            if (vars?.input?.img_id) {
                                if (Array.isArray(vars.input.img_id)) {
                                    await cloudinary.api.delete_resources(
                                        vars.input.img_id
                                    );
                                } else {
                                    await cloudinary.uploader.destroy(
                                        vars.input.img_id
                                    );
                                }
                            }
                        },
                    };
                },
            },
        ],
        formatError: (formattedError, err) => {
            logger.error(formattedError);

            // Don't show DB Errors to user
            if (
                unwrapResolverError(err) instanceof
                Prisma.PrismaClientKnownRequestError
            ) {
                return { ...formattedError, message: "Database Error" };
            }
            return formattedError;
        },
    });
    await server.start();

    const corsOptions = {
        origin: [process.env.CLIENT_URL!],
        credentials: true,
    };
    //graphql cors middleware
    app.use(
        "/graphql",
        cors(corsOptions),
        expressMiddleware(server, {
            context: async ({ req, res }) => ({ req, res }),
        })
    );
    app.use(cors(corsOptions));
    //init passport
    app.use(passport.initialize());

    //REST API Routes
    app.use("/api/auth", authRouter);
    app.use("/api/editor", editorRouter);
    app.use("/api/payment", paymentRouter);
    app.use("/", (req, res) => {
        res.send("Welcome to Tech Stop demo server");
    });

    // not found middleware
    app.use(notFound);
    app.use(errorHandlerMiddleware);

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
        logger.info(`Server is running on port ${port}...`);
    });
})();
