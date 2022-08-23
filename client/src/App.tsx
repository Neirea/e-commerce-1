import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import GQLTEST from "./GQLTest";

function App() {
	const client = new ApolloClient({
		cache: new InMemoryCache(),
		uri: "http://localhost:3001/graphql",
	});

	return (
		<ApolloProvider client={client}>
			<GQLTEST></GQLTEST>
		</ApolloProvider>
	);
}

export default App;
