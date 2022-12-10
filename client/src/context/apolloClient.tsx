import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";
import { offsetLimitPagination } from "@apollo/client/utilities";
import { serverUrl } from "../utils/server";
import { CartType } from "./useApolloCartStore";

export const cartVar = makeVar<CartType>([]);

const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                filteredProducts: offsetLimitPagination(["input"]),
                featuredProducts: offsetLimitPagination(["input"]),
                popularProducts: offsetLimitPagination(["input"]),
                relatedProducts: offsetLimitPagination(["input"]),
                cart: {
                    read() {
                        return cartVar();
                    },
                },
            },
        },
    },
});

const client = new ApolloClient({
    cache: cache,
    uri: `${serverUrl}/graphql`,
    credentials: "include",
});

export default client;
