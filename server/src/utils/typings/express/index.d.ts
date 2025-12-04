import { User as TUser } from "src/database/generated/client";

declare global {
    namespace Express {
        interface User extends TUser {
            id: Pick<TUser, "id">["id"];
        }
    }
}
