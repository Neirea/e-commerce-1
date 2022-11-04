//global config
import "dotenv/config";
import "express-async-errors";
//packages
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ApolloServer } from "apollo-server-express";
import { v2 as cloudinary } from "cloudinary";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import session from "express-session";
import { buildCheckFunction } from "express-validator";
import helmet from "helmet";
import Redis from "ioredis";
import passport from "passport";
//user imports
import apiRouter from "./apiRouter";
import notFound from "./middleware/not-found";
import { resolvers, typeDefs } from "./schema";

export const app = express();

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
    app.use(express.json());

    //session store and middleware
    const RedisStore = connectRedis(session);
    const redisClient = new Redis(process.env.REDIS_URL!);

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
        origin: process.env.CLIENT_URL!,
        credentials: true,
    };
    app.use(cors(corsOptions));
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
                            const vars =
                                initialRequestContext.request.variables;

                            if (vars?.input?.img_id) {
                                if (Array.isArray(vars.input.img_id)) {
                                    vars.input.img_id.forEach(
                                        async (id: string) => {
                                            await cloudinary.uploader.destroy(
                                                id
                                            );
                                        }
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
        formatError: (err) => {
            console.log("Log error:", err);

            // Don't show DB Errors to user
            if (err.originalError instanceof PrismaClientKnownRequestError) {
                return new Error("Internal server error");
            }
            return err;
        },
    });
    await server.start();

    //init passport
    app.use(passport.initialize());

    //graphql cors middleware
    server.applyMiddleware({ app, cors: { origin: true, credentials: true } });

    //REST API Routes
    app.use("/api", apiRouter);
    app.use("/", (req, res) => {
        console.log("base session user=", req.session.user);
        console.log("ip=", req.ip);

        res.send("Welcome to Tech Stop demo server");
    });

    // not found middleware
    app.use(notFound);

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
        console.log(`Server is running on port ${port}...`);
    });
})();
