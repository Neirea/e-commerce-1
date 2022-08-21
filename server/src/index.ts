import { ApolloServer } from "apollo-server-express";

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
	console.log(`server is running at ${url}...`);
});
