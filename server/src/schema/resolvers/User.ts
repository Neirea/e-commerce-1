import { PrismaClient, Role } from "@prisma/client";
import { AuthenticationError } from "apollo-server-express";
import { Request } from "express";
import { GraphQLScalarType, Kind } from "graphql";
import { UpdateUserInput } from "../../generated/graphql";

const prisma = new PrismaClient();

//custom DateTime scalar
const naiveIsoDateRegex =
    /(\d{4})-(\d{2})-(\d{2})T((\d{2}):(\d{2}):(\d{2}))\.(\d{3})Z/;
export const dateScalar = new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    serialize(value: any) {
        return value.getTime(); // Convert outgoing Date to integer for JSON
    },
    parseValue(value: any) {
        if (!naiveIsoDateRegex.test(value)) {
            throw new Error("Invalid date format");
        }
        return new Date(value); // Convert incoming integer to Date
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
        }
        return null; // Invalid hard-coded value (not an integer)
    },
});

const userResolvers = {
    DateTime: dateScalar,
    Query: {
        users: (parent: any, args: undefined, { req }: { req: Request }) => {
            if (!req.session.user?.role.includes(Role.ADMIN)) {
                throw new AuthenticationError(
                    "You don't have permissions for this action"
                );
            }
            return prisma.user.findMany();
            // return prisma.$queryRaw`SELECT * FROM public."User";`;
        },
        user: (
            parent: any,
            { id }: { id: number },
            { req }: { req: Request }
        ) => {
            if (!req.session.user?.role.includes(Role.ADMIN)) {
                throw new AuthenticationError(
                    "You don't have permissions for this action"
                );
            }
            return prisma.user.findUnique({ where: { id: id } });
        },
        showMe: (parent: any, args: undefined, { req }: { req: Request }) => {
            if (!req.session.user) {
                return undefined;
            }
            return req.session.user;
        },
    },
    Mutation: {
        updateUser: async (
            parent: any,
            { input }: { input: UpdateUserInput },
            { req }: { req: Request }
        ) => {
            const { given_name, family_name, email, address, phone } = input;

            const user = await prisma.user.update({
                where: { id: input.id },
                data: { given_name, family_name, email, address, phone },
            });
            if (user) {
                req.session.user = user;
                return true;
            }
            return false;
        },
    },
};

export default userResolvers;
