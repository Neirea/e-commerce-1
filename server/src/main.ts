import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as passport from "passport";
import * as session from "express-session";
import RedisStore from "connect-redis";
import Redis from "ioredis";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Initialize redis client.
    const redisClient = new Redis();
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

    await app.listen(5000);
}
bootstrap();
