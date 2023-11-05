import { NextFunction, Request, Response } from "express";
import Post from "../models/postSchema";

/**
 * create post
 */
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

/**
 * update post
 */
const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  const { _id, tags, caption } = req.body;
  let findPostToUpdate = await Post.find({ _id });
  if (!findPostToUpdate) throw new Error("Couldn't find out the post");

  findPostToUpdate[0].caption = caption;
  findPostToUpdate[0].tags = tags;

  await findPostToUpdate[0].save();
  res.status(200).json(findPostToUpdate);
  console.log({ findPostToUpdate });
};

export { createPost, updatePost };
