import { Role, User } from "@prisma/client";
import { AuthenticationError } from "apollo-server-express";
import { Request } from "express";
import { GraphQLScalarType, Kind } from "graphql";
import { StatusCodes } from "http-status-codes";
import CustomError from "../../errors/custom-error";
import { UpdateUserInput } from "../../generated/graphql";
import prisma from "../../prisma";

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
            throw new CustomError(
                "Invalid date format",
                StatusCodes.BAD_REQUEST
            );
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
            return prisma.$queryRaw`
                SELECT * FROM public."User";
            `;
        },
        user: async (
            parent: any,
            { id }: { id: number },
            { req }: { req: Request }
        ) => {
            if (!req.session.user?.role.includes(Role.ADMIN)) {
                throw new AuthenticationError(
                    "You don't have permissions for this action"
                );
            }
            const user = await prisma.$queryRaw<[User]>`
                SELECT * FROM public."User"
                WHERE id = ${id}
            `;
            return user[0];
        },
        showMe: (parent: any, args: undefined, { req }: { req: Request }) => {
            if (!req.session.user) {
                return undefined;
            }
            return { ...req.session.user, csrfToken: req.session.csrfToken };
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
