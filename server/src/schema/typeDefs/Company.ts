import { gql } from "apollo-server-express";

const companyTypes = gql`
	type Company {
		id: Int!
		name: String!
	}

	extend type Query {
		companies: [Company!]
	}

	input CreateCompanyInput {
		name: String!
	}
	input UpdateCompanyInput {
		id: Int!
		name: String!
	}

	extend type Mutation {
		createCompany(input: CreateCompanyInput!): Company!
		updateCompany(input: UpdateCompanyInput!): Company!
		deleteCompany(id: Int!): Boolean
	}
`;

export default companyTypes;
