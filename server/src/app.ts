import express, { Request, Response } from "express";
require("dotenv").config();
const cors = require("cors");

const server = express();

// use cors
server.use(cors());
server.get("/api/v1", (req: Request, res: Response) => {
  res.send("Hello World!");
});

server.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
