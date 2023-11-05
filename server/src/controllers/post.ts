import { NextFunction, Request, Response } from "express";
import Post from "../models/postSchema";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content, userId, tags, caption, location } = req.body;

    if (!content) throw new Error("Content is Missiing");

    const postCreated = new Post({
      content,
      userId,
      tags: tags ?? [],
      location: location ?? [],
      caption: caption ?? [],
    });
    await postCreated.save();
    res.status(201).json(postCreated);
  } catch (error) {
    next(error);
  }
};

export { createPost };
