import { gql } from "@apollo/client";

export const QUERY_ALL_PRODUCT = gql`
	query GetAllUsers {
		products {
			id
			name
			price
			description
			company
			inventory
			shipping_cost
			discount
			avg_rating
			num_of_reviews
			images
		}
	}
`;
