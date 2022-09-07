import userTypes from "./typeDefs/User";
import userResolvers from "./resolvers/User";
import productTypes from "./typeDefs/Product";
import productResolvers from "./resolvers/Product";
import categoryTypes from "./typeDefs/Category";
import categoryResolvers from "./resolvers/Category";
import { merge } from "lodash";

export const typeDefs = [userTypes, productTypes, categoryTypes];
export const resolvers = merge(
	userResolvers,
	productResolvers,
	categoryResolvers
);
