import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { AppProvider } from "./context/AppContext";
import { serverUrl } from "./utils/server";

const client = new ApolloClient({
	cache: new InMemoryCache(),
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
