import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { v2 as cloudinary } from "cloudinary";
import RedisStore from "connect-redis";
import * as session from "express-session";
import helmet from "helmet";
import * as passport from "passport";
import { createClient } from "redis";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: ["error", "warn"],
        rawBody: true,
    });
    app.setGlobalPrefix("api");
    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.set("trust proxy", true);
    app.use(helmet());
    app.enableCors({ origin: process.env.CLIENT_URL, credentials: true });

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
            name: "techway_sid",
            store: redisStore,
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET,
            resave: false,
            cookie: {
                httpOnly: true,
                domain: process.env.SERVER_DOMAIN,
                secure: process.env.NODE_ENV === "production",
                maxAge: 1000 * 60 * 60 * 24 * 30, //30 days
                sameSite:
                    process.env.NODE_ENV === "production" ? "strict" : "lax",
            },
        }),
    );

    app.use(passport.initialize());
    app.use(passport.session());

    /* Swagger API */
    const config = new DocumentBuilder()
        .setTitle("Techway API")
        .setVersion("1.0")
        .setDescription(
            "Using Google OAuth2 to get session cookie (techway_sid) for protected routes",
        )
        .addOAuth2(
            {
                type: "oauth2",
                flows: {
                    authorizationCode: {
                        authorizationUrl:
                            "https://accounts.google.com/o/oauth2/auth",
                        tokenUrl: "https://accounts.google.com/o/oauth2/token",
                        scopes: {
                            profile: "Access user profile information",
                            email: "Access user email information",
                        },
                    },
                },
            },
            "google",
        )
        .addCookieAuth("techway_sid")
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("/doc", app, document, {
        swaggerOptions: {
            initOAuth: {
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                scopes: ["profile", "email"],
            },
            oauth2RedirectUrl: process.env.GOOGLE_CALLBACK_URL,
        },
    });

    const port = process.env.PORT || 5000;
    await app.listen(port, "0.0.0.0", () =>
        console.log(`Server is listening on ${port}...`),
    );
}
bootstrap();
