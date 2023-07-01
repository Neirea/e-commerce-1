import "express-session";
import { User } from "@prisma/client";

declare module "express-session" {
    interface SessionData {
        passport: {
            user: User;
        };
    }
}
