import { gql } from "apollo-server-express";

const companyTypes = gql`
	type Company {
		id: Int!
		name: String!
		categories: [Category!]
		productCount: Int
	}

	extend type Query {
		companies: [Company!]!
	}

	input CreateCompanyInput {
		name: String!
	}
	input UpdateCompanyInput {
		id: Int!
		name: String!
	}

	extend type Mutation {
		createCompany(input: CreateCompanyInput!): Boolean!
		updateCompany(input: UpdateCompanyInput!): Boolean!
		deleteCompany(id: Int!): Boolean!
	}
`;

export default companyTypes;
