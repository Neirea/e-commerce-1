import { PrismaClient } from "@prisma/client";
import { CreateReviewInput, UpdateReviewInput } from "../../generated/graphql";

const prisma = new PrismaClient({ log: ["query"] });

const reviewResolvers = {
	Query: {
		reviews: (parent: any, { id }: { id: number }) => {
			return prisma.review.findMany({
				where: {
					product_id: id,
				},
			});
		},
	},
	Mutation: {
		createReview: async (
			parent: any,
			{ input }: { input: CreateReviewInput }
		) => {
			await prisma.review.create({
				data: {
					...input,
					comment: input.comment || "",
				},
			});
			return true;
		},
		updateReview: (parent: any, { input }: { input: UpdateReviewInput }) => {
			return prisma.review.update({
				where: { id: input.id },
				data: {
					title: input.title || undefined,
					rating: input.rating || undefined,
					comment: input.comment || undefined,
				},
			});
		},
		deleteReview: (parent: any, { id }: { id: number }) => {
			return prisma.review.delete({ where: { id: id } });
		},
	},
};

export default reviewResolvers;
