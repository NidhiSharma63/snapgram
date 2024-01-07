import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import errorHandle from "./middleware/errorHandle";
import connectDB from "./utils/connectBD";
dotenv.config();

const server = express();

const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
	Query: {
		hello: () => "Hello world!",
	},
};

const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
});

// creating a start function that will connect to database and run the server
const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI || "");
		await apolloServer.start();
		server.use(express.json());
		server.use(express.urlencoded({ extended: true }));
		server.use(cors());

		/** handle error  */
		server.use(errorHandle);
		server.use(expressMiddleware(apolloServer));
		server.listen(process.env.PORT ?? 5000, () => {
			console.log("running at port", process.env.PORT ?? 5000);
		});
	} catch (error) {
		console.log("::error::", error);
	}
};
start();
