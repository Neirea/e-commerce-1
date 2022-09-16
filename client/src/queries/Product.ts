import { gql } from "@apollo/client";

export const QUERY_ALL_PRODUCT = gql`
	query GetAllProducts {
		products {
			id
			name
			price
			description
			company {
				id
				name
			}
			category {
				id
				name
			}
			inventory
			shipping_cost
			discount
			avg_rating
			num_of_reviews
			images {
				img_src
			}
			variants {
				id
			}
		}
	}
`;

export const QUERY_FEATURED_PRODUCTS = gql`
	query GetAllFeaturedProducts {
		products {
			id
			name
			price
			description
			company {
				id
				name
			}
			category {
				id
				name
			}
			inventory
			shipping_cost
			discount
			avg_rating
			num_of_reviews
			images {
				img_id
				img_src
			}
		}
	}
`;

export const GET_SINGLE_PRODUCT = gql`
	query GetSingleProduct($id: Int!) {
		product(id: $id) {
			id
			name
			price
			description
			company {
				id
				name
			}
			category {
				id
				name
			}
			inventory
			shipping_cost
			discount
			avg_rating
			num_of_reviews
			images {
				img_id
				img_src
			}
			variants {
				id
				name
				images {
					img_src
				}
			}
		}
	}
`;

export const MUTATION_CREATE_PRODUCT = gql`
	mutation CreateProduct($input: CreateProductInput!) {
		createProduct(input: $input)
	}
`;

export const MUTATION_UPDATE_PRODUCT = gql`
	mutation UpdateProduct($input: UpdateProductInput!) {
		updateProduct(input: $input)
	}
`;

export const MUTATION_DELETE_PRODUCT = gql`
	mutation DeleteProduct($id: Int!) {
		deleteProduct(id: $id)
	}
`;
