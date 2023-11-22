import { NextFunction, Request, Response } from "express";

const errorHandle = (error: Error, _req: Request, res: Response, next: NextFunction) => {
  // console.log(error.message, "MSG");
  if (
    error.message.toLocaleLowerCase().includes("missing") ||
    error.message.toLocaleLowerCase().includes("exists") ||
    error.message.toLocaleLowerCase().includes("invalid") ||
    error.message.toLocaleLowerCase().includes("found")
  ) {
    return res.status(400).json({ error: error.message, status: 400 });
  } else {
    console.log(error);
    return res.status(500).send({ error: "Internal server error", status: 500 });
  }
};
export default errorHandle;
