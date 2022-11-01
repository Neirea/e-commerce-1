import { gql } from "apollo-server-express";

const categoryTypes = gql`
    type Category {
        id: Int!
        name: String!
        img_id: String
        img_src: String
        parent_id: Int
        companies: [Company!]
        productCount: Int
    }

    extend type Query {
        categories: [Category!]!
    }

    input CreateCategoryInput {
        img_id: String
        img_src: String
        name: String!
        parent_id: Int
    }
    input UpdateCategoryInput {
        id: Int!
        name: String!
        img_id: String
        img_src: String
        parent_id: Int
    }

    extend type Mutation {
        createCategory(input: CreateCategoryInput!): Boolean!
        updateCategory(input: UpdateCategoryInput!): Boolean!
        deleteCategory(id: Int!): Boolean!
    }
`;

export default categoryTypes;
