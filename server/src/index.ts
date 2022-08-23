import "dotenv/config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";

async function startApolloServer() {
	const app = express();
	const server = new ApolloServer({ typeDefs, resolvers });
	const port = process.env.PORT || 5000;

	await server.start();
	server.applyMiddleware({ app });

	app.listen(port, () => {
		console.log(`Server is running on port ${port}...`);
	});
}

startApolloServer();
