import { gql } from "apollo-server-express";

const orderTypes = gql`
    # create scalar or enum for status

    enum Status {
        PENDING
        ACCEPTED
        PROCESSING
        DELIVERED
        CANCELLED
    }

    type SingleOrderItem {
        id: Int!
        order_id: Int!
        amount: Int!
        price: Float!
        product_id: Int!
        product: Product!
    }
    type Order {
        id: Int!
        status: Status!
        user_id: Int
        buyer_name: String!
        buyer_email: String!
        buyer_phone: String
        created_at: DateTime!
        shipping_cost: Float!
        delivery_address: String!
        order_items: [SingleOrderItem!]!
    }

    extend type Query {
        orders: [Order!]!
    }

    extend type Mutation {
        cancelOrder(id: Int!): Boolean!
        deleteOrder(id: Int!): Boolean!
    }
`;

export default orderTypes;
