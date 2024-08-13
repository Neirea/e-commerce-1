import { User as TUser } from "@prisma/client";

declare global {
    namespace Express {
        interface User extends TUser {
            id: Pick<TUser, "id">["id"];
        }
    }
}
