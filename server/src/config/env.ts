export const appConfig = {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    clientUrl: process.env.CLIENT_URL,
    sessionSecret: process.env.SESSION_SECRET,
    tokenSecret: process.env.TOKEN_SECRET,
    cldnryName: process.env.CLDNRY_NAME,
    cldnryApiKey: process.env.CLDNRY_API_KEY,
    cldnryApiSecret: process.env.CLDNRY_API_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
    facebookClientId: process.env.FACEBOOK_CLIENT_ID,
    facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    facebookCallbackUrl: process.env.FACEBOOK_CALLBACK_URL,
    stripePrivateKey: process.env.STRIPE_PRIVATE_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    serverDomain: process.env.SERVER_DOMAIN,
};