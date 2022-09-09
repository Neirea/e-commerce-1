import { gql } from "@apollo/client";

export const QUERY_ALL_CATEGORIES = gql`
	query GetAllCategories {
		categories {
			id
			name
			parent_id
		}
	}
`;

export const MUTATION_CREATE_CATEGORY = gql`
	mutation CreateCategory($input: CreateCategoryInput!) {
		createCategory(input: $input) {
			id
			name
		}
	}
`;

export const MUTATION_UPDATE_CATEGORY = gql`
	mutation UpdateCategory($input: UpdateCategoryInput!) {
		updateCategory(input: $input) {
			id
			name
		}
	}
`;

export const MUTATION_DELETE_CATEGORY = gql`
	mutation DeleteCategory($id: Int!) {
		deleteCategory(id: $id)
	}
`;
