import { gql } from "@apollo/client";

export const QUERY_ALL_PRODUCT = gql`
	query GetAllProducts {
		products {
			id
			name
			price
			description
			company_id
			inventory
			shipping_cost
			discount
			avg_rating
			num_of_reviews
			images
		}
	}
`;

export const MUTATION_CREATE_PRODUCT = gql`
	mutation CreateProduct($input: CreateProductInput!) {
		createProduct(input: $input) {
			id
			name
		}
	}
`;
