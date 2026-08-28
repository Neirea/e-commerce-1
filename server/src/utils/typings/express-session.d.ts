import "express-session";
import { User } from "../../database/generated/client.js";

declare module "express-session" {
    interface SessionData {
        passport: {
            user: User;
        };
    }
}
