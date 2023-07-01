import { User as IUser } from "@prisma/client";

declare global {
    namespace Express {
        interface User extends IUser {
            // redefined to remove lint error
            id: Pick<IUser, "id">["id"];
        }
    }
}
