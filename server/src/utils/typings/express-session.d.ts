import "express-session";
import { User } from "src/database/generated/client";

declare module "express-session" {
    interface SessionData {
        passport: {
            user: User;
        };
    }
}
