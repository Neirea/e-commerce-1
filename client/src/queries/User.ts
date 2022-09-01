import { gql } from "@apollo/client";

export const QUERY_ALL_USERS = gql`
	query GetAllUsers {
		users {
			... on UsersQueryResult {
				users {
					id
					username
				}
			}
			... on UsersErrorResult {
				message
			}
		}
	}
`;
export const QUERY_SINGLE_USER = gql`
	query GetSingleUser($id: ID!) {
		user(id: $id) {
			id
			username
			role
		}
	}
`;
export const MUTATION_CREATE_USER = gql`
	mutation CreateUser($input: CreateUserInput!) {
		createUser(input: $input) {
			id
			name
			username
		}
	}
`;
