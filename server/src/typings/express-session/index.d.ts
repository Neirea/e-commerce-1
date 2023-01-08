import "express-session";
import { User as IUser } from "@prisma/client";

declare module "express-session" {
    interface SessionData {
        user: IUser;
        csrfToken: string | undefined;
    }
}
