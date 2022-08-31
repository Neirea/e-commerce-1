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

	input CreateReviewInput implements ReviewInputType {
		product_id: ID!
	}
	input UpdateReviewInput implements ReviewInputType {
	}

	extend type Mutation {
		createReview(input: CreateReviewInput!): Review!
		updateReview(input: UpdateReviewInput!): Review!
		deleteReview(id: ID!): Review
	}
`;

export default reviewTypes;
