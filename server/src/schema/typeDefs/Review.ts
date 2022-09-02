import { gql } from "apollo-server-express";

const reviewTypes = gql`
	type Review {
		id: ID!
		title: String
		rating: Int!
		comment: String
		created_at: DateTime!
		updated_at: DateTime!
		product_id: ID!
	}

	extend type Query {
		reviews: [Review!]
	}

	interface ReviewInputType {
		title: String
		rating: Int!
		comment: String
	}

	input CreateReviewInput {
		title: String
		rating: Int!
		comment: String
		product_id: ID!
	}
	input UpdateReviewInput {
		title: String
		rating: Int!
		comment: String
	}

	extend type Mutation {
		createReview(input: CreateReviewInput!): Review!
		updateReview(input: UpdateReviewInput!): Review!
		deleteReview(id: ID!): Review
	}
`;

export default reviewTypes;
