import { NextFunction, Request, Response } from "express";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content, userId, tags, caption, location } = req.body;
    res.status(202).json({ message: "successfully logged out" });
  } catch (error) {
    next(error);
  }
};
