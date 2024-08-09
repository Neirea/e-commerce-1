import { User as TUser } from "@prisma/client";

declare global {
    namespace Express {
        interface User extends TUser {
            // redefined to remove lint error
            id: Pick<TUser, "id">["id"];
        }
    }
}
