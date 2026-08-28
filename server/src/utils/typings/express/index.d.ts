import { User as TUser } from "../../../database/generated/client.js";

declare global {
    namespace Express {
        interface User extends TUser {
            id: Pick<TUser, "id">["id"];
        }
    }
}
