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
				parent_id
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

export const QUERY_FILTERED_PRODUCTS = gql`
	query GetFilteredProducts(
		$limit: Int!
		$offset: Int!
		$input: QueryProductInput!
	) {
		filteredProducts(limit: $limit, offset: $offset, input: $input) {
			id
			name
			price
			inventory
			discount
			avg_rating
			num_of_reviews
			images {
				img_src
			}
			company {
				id
				name
			}
			_count {
				orders
			}
		}
	}
`;

export const QUERY_SEARCH_DATA = gql`
	query GetSearchData($input: QueryPriceInput!) {
		searchData(input: $input) {
			min
			max
			categories {
				id
				name
				parent_id
				productCount
			}
			companies {
				id
				name
				productCount
			}
		}
	}
`;

export const QUERY_FEATURED_PRODUCTS = gql`
	query GetFeaturedProducts($limit: Int!, $offset: Int!) {
		featuredProducts(limit: $limit, offset: $offset) {
			id
			name
			price
			inventory
			discount
			avg_rating
			num_of_reviews
			images {
				img_src
			}
		}
	}
`;

export const QUERY_POPULAR_PRODUCTS = gql`
	query GetPopularProducts($limit: Int!, $offset: Int!) {
		popularProducts(limit: $limit, offset: $offset) {
			id
			name
			price
			inventory
			discount
			avg_rating
			num_of_reviews
			images {
				img_src
			}
		}
	}
`;

export const QUERY_RELATED_PRODUCTS = gql`
	query GetRelatedProducts(
		$limit: Int!
		$offset: Int!
		$input: QueryRelatedInput!
	) {
		relatedProducts(limit: $limit, offset: $offset, input: $input) {
			id
			name
			price
			inventory
			discount
			avg_rating
			num_of_reviews
			images {
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
