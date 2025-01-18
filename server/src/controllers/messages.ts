import type { NextFunction, Request, Response } from "express";
import Chat from "../models/messageSchema";

const getAllMessages = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { roomId, lastMessageId, userId } = req.query;
	if (!userId) throw new Error("User id is Missiing");
	try {
		if (!lastMessageId) {
			const messages = await Chat.find({ roomId })
				.sort({ timestamp: -1 })
				.limit(20) // Fetch the previous 20 messages, for example
				.lean();
			res.status(200).json(messages);
			return;
		}
		const messages = await Chat.find({ roomId, _id: { $lt: lastMessageId } })
			.sort({ timestamp: -1 })
			.limit(20) // Fetch the previous 20 messages, for example
			.lean();
		res.status(200).json(messages);
	} catch (error) {
		next(error);
	}
};

const deleteMessage = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { messageId, userId } = req.query;
	if (!userId) throw new Error("User id is Missiing");
	try {
		// delete the message
		await Chat.findByIdAndUpdate({ _id: messageId });
	} catch (error) {
		next(error);
	}
};
export { deleteMessage, getAllMessages };

