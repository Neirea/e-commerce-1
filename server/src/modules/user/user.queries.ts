import { Prisma } from "src/database/generated/client";
import { UpdateUserDto } from "./dto/update-user.dto";
import { TUserId } from "./user.types";

export const allUsersQuery = Prisma.sql`
    SELECT * FROM public."User";
`;

export const UserByIdQuery = (id: TUserId): Prisma.Sql => Prisma.sql`
    SELECT * FROM public."User"
    WHERE id = ${id}
`;

export const updateUserQuery = (
    id: TUserId,
    input: UpdateUserDto,
): Prisma.Sql => Prisma.sql`
    UPDATE public."User"
    SET "given_name" = ${input.given_name},
        "family_name" = ${input.family_name},
        "email" = ${input.email},
        "address" = ${input.address},
        "phone" = ${input.phone}
    WHERE id = ${id}
    RETURNING *
`;
