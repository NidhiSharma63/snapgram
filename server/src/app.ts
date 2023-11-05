import * as dotenv from "dotenv";
import express from "express";
import router from "./routes/routes";
import connectDB from "./utils/connectBD";
dotenv.config();

const cors = require("cors");

const server = express();

// use cors
server.use(cors());
server.use("/api/v1", router);
// creating a start function that will connect to database and run the server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI || "");
    server.listen(process.env.PORT ?? 3000, () => {
      console.log("running at port", process.env.PORT ?? 3000);
    });
  } catch (error) {
    console.log("::error::", error);
  }
};
start();
