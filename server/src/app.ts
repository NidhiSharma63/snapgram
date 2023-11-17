import * as dotenv from "dotenv";
import express from "express";
import errorHandle from "./middleware/errorHandle";
import router from "./routes/routes";
import connectDB from "./utils/connectBD";
dotenv.config();

const cors = require("cors");

const server = express();

// Middleware to parse incoming requests with JSON payloads
server.use(express.json());

// Middleware to parse incoming requests with urlencoded payloads
server.use(express.urlencoded({ extended: true }));

// use cors
server.use(cors());
server.use("/api/v1", router);

/**
 * handle error
 */

server.use(errorHandle);

// creating a start function that will connect to database and run the server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI || "");
    server.listen(process.env.PORT ?? 5000, () => {
      console.log("running at port", process.env.PORT ?? 5000);
    });
  } catch (error) {
    console.log("::error::", error);
  }
};
start();
