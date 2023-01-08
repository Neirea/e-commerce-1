import { User as IUser } from "@prisma/client";

declare global {
    namespace Express {
        interface User {
            user: IUser;
        }
    }
}
