import { NextFunction, Request, Response } from "express";
import Like from "../models/likesSchema";

/**
 * Add likes
 */
const addLikes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, postId } = req.body;

    if (!postId) throw new Error("Post id is Missiing");
    if (!userId) throw new Error("User id is Missiing");

    let isAlreadyPresentPost = await Like.findOne({ postId });
    if (isAlreadyPresentPost) {
      isAlreadyPresentPost.likes.push(userId);
      res.status(201).json(isAlreadyPresentPost);
    } else {
      let createNewLikesObj = new Like({
        postId,
        likes: userId,
      });
      await createNewLikesObj.save();
      res.status(201).json(createNewLikesObj);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * remove likes
 */

const removeLikes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, postId } = req.body;

    if (!postId) throw new Error("Post id is Missiing");
    if (!userId) throw new Error("User id is Missiing");

    const updateLikesInPost = await Like.findOneAndUpdate({ postId }, { $pull: { likes: userId } }, { new: true });
    res.status(201).json(updateLikesInPost);
  } catch (error) {
    next(error);
  }
};

export { addLikes, removeLikes };
