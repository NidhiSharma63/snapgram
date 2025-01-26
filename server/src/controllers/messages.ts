import type { NextFunction, Request, Response } from "express";
import { pusher } from "../app";
import Chat from "../models/messageSchema";


/** get All messages */
const getAllMessages = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { roomId, lastMessageId, userId } = req.query;
	// console.log(req.query)
	if (!userId) throw new Error("User id is Missing");
	if(!roomId) throw new Error("Room id is Missing");
	try {
		if (!lastMessageId) {
			const messages = await Chat.find({ roomId })
				.sort({ createdAt: -1 }) // Sort by timestamp in descending order, latest first
				.limit(20) // Fetch the previous 20 messages, for example
				.lean(); // Convert Mongoose documents to plain JavaScript objects
			res.status(200).json(messages);
			return;
		}

		const messages = await Chat.find({ roomId, _id: { $lt: lastMessageId } })
			.sort({ createdAt: -1 }) // Sort by timestamp in descending order, latest first
			.limit(20)
			.lean();
		res.status(200).json(messages);
	} catch (error) {
		next(error);
	}
};

/**
 * delete message
 */
const deleteMessage = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { messageId, userId ,roomId} = req.body;
	if (!userId) throw new Error("User id is Missing");
	if(!roomId) throw new Error("Room id is Missing");
	if(!messageId) throw new Error("Message id is Missing");
	try {
		// delete the message
		const message = await Chat.findOneAndDelete({ _id: messageId });
		await pusher.trigger(`public-${roomId}`, "message-deleted", 
      {
				messageId,
				senderId:userId
			}
    );
		res.status(201).json(message);
	} catch (error) {
		next(error);
	}
};

/**
 * add message 
 */
const addMessage = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { roomId, message, receiverId ,senderId,createdAt,userId} = req.body;
		if (!userId) throw new Error("User id is Missing");
		if(!roomId) throw new Error("Room id is Missing");
		const newMessage = new Chat({
			roomId,
			message,
			senderId,
			receiverId,
			createdAt,
		});
		await newMessage.save();
		await pusher.trigger(`public-${roomId}`, "message-received", 
      newMessage
    );
		res.status(201).json(newMessage);
	} catch (error) {
		next(error);
	}

}
export { addMessage, deleteMessage, getAllMessages };

