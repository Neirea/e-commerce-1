import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { v2 as cloudinary } from "cloudinary";
import RedisStore from "connect-redis";
import * as session from "express-session";
import * as passport from "passport";
import helmet from "helmet";
import { createClient } from "redis";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: ["error", "warn"],
        rawBody: true,
    });
    app.set("truxt proxy", true);
    app.setGlobalPrefix("api");
    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.use(helmet());

    cloudinary.config({
        cloud_name: process.env.CLDNRY_NAME,
        api_key: process.env.CLDNRY_API_KEY,
        api_secret: process.env.CLDNRY_API_SECRET,
    });

    const redisClient = createClient({
        url: process.env.REDIS_URL,
    });
    redisClient.connect().catch(console.error);

    const redisStore = new RedisStore({
        client: redisClient,
    });
    app.use(
        session({
            name: "s_id",
            store: redisStore,
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET,
            resave: false,
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 1000 * 60 * 60 * 24 * 30, //30 days
                sameSite:
                    process.env.NODE_ENV === "production" ? "none" : undefined,
            },
        }),
    );
    app.enableCors({ credentials: true, origin: process.env.CLIENT_URL });
    app.use(passport.initialize());

    const port = process.env.PORT || 5000;
    await app.listen(port, "0.0.0.0", () =>
        console.log(`Server is listening on ${port}...`),
    );
}
bootstrap();
