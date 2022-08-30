import userTypeDefs from "./typeDefs/User";
import userResolvers from "./resolvers/User";
import productTypes from "./typeDefs/Product";
import productResolvers from "./resolvers/Product";
import { merge } from "lodash";

export const typeDefs = [userTypeDefs, productTypes];
export const resolvers = merge(userResolvers, productResolvers);
