import cors from 'cors';
// import * as dotenv from "dotenv";
import express from "express";
import Pusher from "pusher";
import errorHandle from "./middleware/errorHandle";
import router from "./routes/routes";
import connectDB from "./utils/connectBD";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to parse incoming requests with JSON payloads

// Middleware to parse incoming requests with urlencoded payloads

// Add CORS middleware before all routes
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

console.log("process.env.CLIENT_URL", process.env.CLIENT_URL);
app.options("*", (req, res) => {
  res.sendStatus(200);
});
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
		app.listen(process.env.PORT ?? 5000, () => {
			console.log("running at port", process.env.PORT ?? 5000);
		});
	} catch (error) {
		console.log("::error::", error);
	}
};
start();
