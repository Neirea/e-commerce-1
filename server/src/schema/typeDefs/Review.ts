import { gql } from "apollo-server-express";

const reviewTypes = gql`
	type Review {
		id: Int!
		title: String
		rating: Int!
		comment: String
		created_at: DateTime!
		updated_at: DateTime!
		product_id: Int!
	}

	extend type Query {
		reviews(id: Int!): [Review!]
	}
	input CreateReviewInput {
		user_id: Int!
		title: String!
		rating: Int!
		comment: String
		product_id: Int!
	}
	input UpdateReviewInput {
		id: Int!
		title: String
		rating: Int
		comment: String
	}

	extend type Mutation {
		createReview(input: CreateReviewInput!): Boolean!
		updateReview(input: UpdateReviewInput!): Boolean!
		deleteReview(id: Int!): Boolean!
	}
`;

export default reviewTypes;
