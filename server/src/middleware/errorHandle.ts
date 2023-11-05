import { NextFunction, Request, Response } from "express";

const errorHandle = (error: Error, _req: Request, res: Response, next: NextFunction) => {
  return res.status(400).send(error.message);
};
export default errorHandle;
