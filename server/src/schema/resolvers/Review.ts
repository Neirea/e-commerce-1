import { GraphQLScalarType, Kind } from "graphql";
import { PrismaClient } from "@prisma/client";
import GraphQLJSON from "graphql-type-json";

const prisma = new PrismaClient({ log: ["query"] });

const reviewResolvers = {
	Query: {
		reviews: (parent: any, args: any) => {
			const reviews = prisma.$queryRaw`SELECT * FROM public."Review";`;
			console.log("reviews=", reviews);

			return reviews;
			//add error handling
			if (reviews) return { reviews: reviews };
			return { message: "There was an Error" };
		},
	},
	Mutation: {
		createReview: (parent: any, args: any) => {
			const category = args.input;

			return prisma.review.create({ data: category });
		},
		updateReview: (parent: any, args: any) => {
			const review_id = args.input.id;
			return prisma.review.update({
				where: { id: review_id },
				data: { ...args.input }, // probably wrong #any
			});
		},
		deleteReview: (parent: any, args: any) => {
			return prisma.review.delete({ where: { id: args.id } });
		},
	},
};

export default reviewResolvers;
