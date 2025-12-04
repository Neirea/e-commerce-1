import { Prisma } from "src/database/generated/client";

export const userByPlatformIdQuery = (
    platform_id: string,
): Prisma.Sql => Prisma.sql`
    SELECT * FROM public."User"
    WHERE platform_id = ${platform_id}
`;

export const userCountQuery = Prisma.sql`
    SELECT COUNT(*)::int FROM public."User"
`;
