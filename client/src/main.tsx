import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { offsetLimitPagination } from "@apollo/client/utilities";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AppProvider } from "./context/AppContext";
import { CartProvider } from "./context/CartContext";
import { serverUrl } from "./utils/server";

const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                filteredProducts: offsetLimitPagination(),
                featuredProducts: offsetLimitPagination(),
                popularProducts: offsetLimitPagination(),
                relatedProducts: offsetLimitPagination(),
            },
        },
    },
});

const client = new ApolloClient({
    cache: cache,
    uri: `${serverUrl}/graphql`,
    credentials: "include",
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <ApolloProvider client={client}>
                <AppProvider>
                    <CartProvider>
                        <App />
                    </CartProvider>
                </AppProvider>
            </ApolloProvider>
        </BrowserRouter>
    </React.StrictMode>
);
