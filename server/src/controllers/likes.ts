import { NextFunction, Request, Response } from "express";
import Like from "../models/likesSchema";

/**
 * Add likes
 */
const addLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, postId } = req.body;

    if (!postId) throw new Error("Post id is Missiing");
    if (!userId) throw new Error("User id is Missiing");

    let isAlreadyPresentPost = await Like.findOne({ userId });
    if (isAlreadyPresentPost) {
      isAlreadyPresentPost.postId.push(postId);
      await isAlreadyPresentPost.save();
      res.status(201).json(isAlreadyPresentPost);
    } else {
      let createNewLikesObj = new Like({
        postId,
        userId,
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

const removeLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, postId: postIdToRemove } = req.body;

    if (!postIdToRemove) throw new Error("Post id is Missiing");
    if (!userId) throw new Error("User id is Missiing");

    const updateLikesInPost = await Like.findOneAndUpdate(
      { userId },
      { $pull: { postId: postIdToRemove } },
      { new: true }
    );
    res.status(201).json(updateLikesInPost);
  } catch (error) {
    next(error);
  }
};

/**
 * get All like post
 */

const getAllLikePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.query;

    if (!userId) throw new Error("User id is Missiing");

    const allLikePost = await Like.find({ userId });
    res.status(201).json(allLikePost);
  } catch (error) {
    next(error);
  }
};
export { addLike, getAllLikePost, removeLike };
