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
            csrfToken
        }
    }
`;

export const MUTATION_UPDATE_USER = gql`
    mutation UpdateUser($input: UpdateUserInput!) {
        updateUser(input: $input)
    }
`;
