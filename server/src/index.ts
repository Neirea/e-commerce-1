import { ApolloServer } from "apollo-server-express";
import "dotenv/config";
import app from "./app";
import { resolvers, typeDefs } from "./schema";

(async () => {
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: () => {
			return { name: "Neirea" };
		},
	});
	// resolvers:[...,...,...]
	const port = process.env.PORT || 5000;

	await server.start();
	server.applyMiddleware({ app });

	app.listen(port, () => {
		console.log(`Server is running on port ${port}...`);
	});
})();
