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
		createCompany(input: $input) {
			id
			name
		}
	}
`;

export const MUTATION_DELETE_COMPANY = gql`
	mutation DeleteCompany($id: Int!) {
		deleteCompany(id: $id)
	}
`;
