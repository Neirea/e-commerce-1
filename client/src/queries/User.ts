import { gql } from "@apollo/client";

export const QUERY_SHOW_ME = gql`
	query ShowCurrentUser {
		showMe {
			id
			given_name
			family_name
			email
			address
			phone
			avatar
			role
		}
	}
`;

export const MUTATION_UPDATE_USER = gql`
	mutation UpdateUser($input: UpdateUserInput!) {
		updateUser(input: $input)
	}
`;

export const MUTATION_LOGOUT = gql`
	mutation Logout {
		logout
	}
`;
