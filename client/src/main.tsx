import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { AppProvider } from "./context/AppContext";

const client = new ApolloClient({
	cache: new InMemoryCache(),
	uri: `${import.meta.env.VITE_SERVER_URL}/graphql`,
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
