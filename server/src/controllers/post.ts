import { NextFunction, Request, Response } from "express";
import Post from "../models/postSchema";

/**
 * create post
 */
const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { file, userId, tags, caption, location } = req.body;

    if (!file) throw new Error("Media is Missiing");

    const postCreated = new Post({
      file,
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
  try {
    const { _id, tags, caption } = req.body;
    let findPostToUpdate = await Post.find({ _id });
    if (!findPostToUpdate) throw new Error("Couldn't find out the post");

    findPostToUpdate[0].caption = caption;
    findPostToUpdate[0].tags = tags;

    await findPostToUpdate[0].save();
    res.status(200).json(findPostToUpdate);
  } catch (error) {
    next(error);
  }
};

/**
 * delete post
 */
const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id } = req.body;
    let findPostToDelete = await Post.findOneAndDelete({ _id });
    if (!findPostToDelete) throw new Error("Couldn't find out the post");
    res.status(204).json(findPostToDelete);
  } catch (error) {
    next(error);
  }
};

export { createPost, deletePost, updatePost };
