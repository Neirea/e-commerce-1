import { gql } from "@apollo/client";

export const QUERY_ALL_COMPANIES = gql`
    query GetAllCompanies {
        companies {
            id
            name
        }
    }
`;

export const MUTATION_CREATE_COMPANY = gql`
    mutation CreateCompany($input: CreateCompanyInput!) {
        createCompany(input: $input)
    }
`;
export const MUTATION_UPDATE_COMPANY = gql`
    mutation UpdateCompany($input: UpdateCompanyInput!) {
        updateCompany(input: $input)
    }
`;

export const MUTATION_DELETE_COMPANY = gql`
    mutation DeleteCompany($id: Int!) {
        deleteCompany(id: $id)
    }
`;
