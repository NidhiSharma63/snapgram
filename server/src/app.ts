import cors from "cors";
import { type Server as HTTPServer, createServer } from "node:http";
// import * as dotenv from "dotenv";
import express from "express";
import Pusher from "pusher";
import errorHandle from "./middleware/errorHandle";
import router from "./routes/routes";
import connectDB from "./utils/connectBD";
import { initSocket } from "./utils/socket";
// dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server: HTTPServer = createServer(app);
initSocket(server); // Initialize Socket.IO by passing the server instance

// Middleware to parse incoming requests with JSON payloads

// Middleware to parse incoming requests with urlencoded payloads

// use cors
app.use(cors());
app.use("/api/v1", router);

/**
 * handle error
 */

app.use(errorHandle);


// Pusher instance
export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || "",
  key: process.env.PUSHER_KEY || "",
  secret: process.env.PUSHER_SECRET || "",
  cluster: process.env.PUSHER_CLUSTER || "",
  useTLS: true,  // Ensures encryption
});

// creating a start function that will connect to database and run the server
const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI || "");
		console.log("Triggering event...");
		pusher.trigger("my-channel", "my-event", { message: "hello world" });
		console.log("Event triggered");
		server.listen(process.env.PORT ?? 5000, () => {
			console.log("running at port", process.env.PORT ?? 5000);
		});
	} catch (error) {
		console.log("::error::", error);
	}
};
start();
