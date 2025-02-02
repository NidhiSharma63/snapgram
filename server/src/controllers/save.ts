import type { NextFunction, Request, Response } from "express";
import Save from "../models/saveSchema";

/**
 * Add saves
 */
const addSaves = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { userId, postId } = req.body;

		if (!postId) throw new Error("Post id is Missiing");
		if (!userId) throw new Error("User id is Missiing");

		const isAlreadyPresentPost = await Save.findOne({ userId });
		if (isAlreadyPresentPost) {
			isAlreadyPresentPost.postId.push(postId);
			await isAlreadyPresentPost.save();
			res.status(201).json(isAlreadyPresentPost);
		} else {
			const createNewLikesObj = new Save({
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
 * remove saves
 */

const removeSaves = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { userId, postId: postIdToRemove } = req.body;

		if (!postIdToRemove) throw new Error("Post id is Missiing");
		if (!userId) throw new Error("User id is Missiing");

		const updateLikesInPost = await Save.findOneAndUpdate(
			{ userId },
			{ $pull: { postId: postIdToRemove } },
			{ new: true },
		);
		res.status(201).json(updateLikesInPost);
	} catch (error) {
		next(error);
	}
};

/**
 * get all save
 */

const getAllSavePost = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { userId } = req.query;

		if (!userId) throw new Error("User id is Missiing");

		const allSavePost = await Save.find({ userId }).setOptions({ lean: true });
		res.status(201).json(allSavePost);
	} catch (error) {
		next(error);
	}
};

export { addSaves, getAllSavePost, removeSaves };
