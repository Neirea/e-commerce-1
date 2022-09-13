import { gql } from "@apollo/client";

export const QUERY_ALL_PRODUCT = gql`
	query GetAllProducts {
		products {
			id
			name
			price
			description
			company_id
			category_id
			inventory
			shipping_cost
			discount
			avg_rating
			num_of_reviews
			images {
				img_src
			}
		}
	}
`;

export const QUERY_FEATURED_PRODUCTS = gql`
	query GetAllProducts {
		products {
			id
			name
			price
			description
			company_id
			category_id
			inventory
			shipping_cost
			discount
			avg_rating
			num_of_reviews
			images {
				img_src
			}
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

export const MUTATION_UPDATE_PRODUCT = gql`
	mutation UpdateProduct($input: UpdateProductInput!) {
		updateProduct(input: $input) {
			id
			name
		}
	}
`;

export const MUTATION_DELETE_PRODUCT = gql`
	mutation DeleteProduct($id: Int!) {
		deleteProduct(id: $id)
	}
`;
