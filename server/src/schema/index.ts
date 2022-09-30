import userTypes from "./typeDefs/User";
import userResolvers from "./resolvers/User";
import productTypes from "./typeDefs/Product";
import productResolvers from "./resolvers/Product";
import categoryTypes from "./typeDefs/Category";
import categoryResolvers from "./resolvers/Category";
import companyTypes from "./typeDefs/Company";
import companyResolvers from "./resolvers/Company";
import reviewTypes from "./typeDefs/Review";
import reviewResolvers from "./resolvers/Review";
import orderTypes from "./typeDefs/Order";
import orderResolvers from "./resolvers/Order";
import { merge } from "lodash";

export const typeDefs = [
	userTypes,
	productTypes,
	categoryTypes,
	companyTypes,
	reviewTypes,
	orderTypes,
];
export const resolvers = merge(
	userResolvers,
	productResolvers,
	categoryResolvers,
	companyResolvers,
	reviewResolvers,
	orderResolvers
);
