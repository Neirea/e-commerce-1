import { Prisma } from "@prisma/client";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserId } from "./user.types";

export const allUsersQuery = Prisma.sql`
    SELECT * FROM public."User";
`;

export const UserByIdQuery = (id: UserId) => Prisma.sql`
    SELECT * FROM public."User"
    WHERE id = ${id}
`;

export const updateUserQuery = (id: UserId, input: UpdateUserDto) => Prisma.sql`
    UPDATE public."User"
    SET "given_name" = ${input.given_name},
        "family_name" = ${input.family_name},
        "email" = ${input.email},
        "address" = ${input.address},
        "phone" = ${input.phone}
    WHERE id = ${id}
    RETURNING *
`;
