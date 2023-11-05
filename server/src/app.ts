import * as dotenv from "dotenv";
import express from "express";
import router from "./routes/routes";
dotenv.config();

const cors = require("cors");

const server = express();

// use cors
server.use(cors());
server.use("/api/v1", router);

server.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
