import { merge } from "lodash";
import categoryResolvers from "./resolvers/Category";
import companyResolvers from "./resolvers/Company";
import orderResolvers from "./resolvers/Order";
import productResolvers from "./resolvers/Product";
import userResolvers from "./resolvers/User";
import categoryTypes from "./typeDefs/Category";
import companyTypes from "./typeDefs/Company";
import orderTypes from "./typeDefs/Order";
import productTypes from "./typeDefs/Product";
import userTypes from "./typeDefs/User";

export const typeDefs = [
    userTypes,
    productTypes,
    categoryTypes,
    companyTypes,
    orderTypes,
];
export const resolvers = merge(
    userResolvers,
    productResolvers,
    categoryResolvers,
    companyResolvers,
    orderResolvers
);
