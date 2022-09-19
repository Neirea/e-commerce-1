import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { AppProvider } from "./context/AppContext";
import { serverUrl } from "./utils/server";
import { offsetLimitPagination } from "@apollo/client/utilities";

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
					<App />
				</AppProvider>
			</ApolloProvider>
		</BrowserRouter>
	</React.StrictMode>
);
