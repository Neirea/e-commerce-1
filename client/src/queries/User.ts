import { gql } from "@apollo/client";

export const QUERY_SINGLE_USER = gql`
	query GetSingleUser($id: Int!) {
		user(id: $id) {
			id
			role
		}
	}
`;

export const QUERY_SHOW_ME = gql`
	query ShowCurrentUser {
		showMe {
			id
			given_name
			family_name
			role
			avatar
		}
	}
`;
export const MUTATION_LOGOUT = gql`
	mutation Logout {
		logout
	}
`;
