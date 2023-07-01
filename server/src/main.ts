import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { v2 as cloudinary } from "cloudinary";
import RedisStore from "connect-redis";
import * as session from "express-session";
import * as passport from "passport";
import { createClient } from "redis";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        rawBody: true,
    });
    app.enableCors({ credentials: true, origin: true });
    app.setGlobalPrefix("api");
    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, transform: true }),
    );

    cloudinary.config({
        cloud_name: process.env.CLDNRY_NAME,
        api_key: process.env.CLDNRY_API_KEY,
        api_secret: process.env.CLDNRY_API_SECRET,
    });

    const redisClient = createClient();
    redisClient.connect().catch(console.error);

    const redisStore = new RedisStore({
        client: redisClient,
    });
    app.use(
        session({
            name: "sid",
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
    app.use(passport.initialize());
    app.use(passport.session());

    await app.listen(5000, "0.0.0.0");
}
bootstrap();
