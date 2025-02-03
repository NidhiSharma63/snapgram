import type { NextFunction, Request, Response } from "express";
import Chat from "../models/messageSchema";
import pusher from "../utils/pusher";


/** get All messages */
const getAllMessages = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { roomId, lastMessageId, userId } = req.query;
	// console.log(req.query)
	if (!userId) throw new Error("User id is Missing");
	if (!roomId) throw new Error("Room id is Missing");
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
	const { messageId, userId, roomId } = req.body;
	if (!userId) throw new Error("User id is Missing");
	if (!roomId) throw new Error("Room id is Missing");
	if (!messageId) throw new Error("Message id is Missing");
	try {
		// delete the message
		const message = await Chat.findOneAndDelete({ _id: messageId });
		await pusher.trigger(`public-${roomId}`, "message-deleted",
			{
				messageId,
				senderId: userId
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
		const { roomId, message, receiverId, senderId, createdAt, userId, replyText } = req.body;
		if (!userId) throw new Error("User id is Missing");
		if (!roomId) throw new Error("Room id is Missing");
		const newMessage = new Chat({
			roomId,
			message,
			senderId,
			receiverId,
			createdAt,
			replyText
		});
		await newMessage.save();
		await pusher.trigger(`public-${roomId}`, "message-received",
			newMessage
		);
		await pusher.trigger(`notification-${receiverId}`, "unread-message",
			newMessage)
		res.status(201).json(newMessage);
	} catch (error) {
		next(error);
	}

}

/**
 * Mark Message Read
 */
const markMessageRead = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { roomId,userId } = req.body;
		if (!userId) throw new Error("User id is Missing");
		if (!roomId) throw new Error("Room id is Missing");
		const lastMessage = await Chat.findOne({ roomId })
			.sort({ createdAt: -1 })
			.lean();

		// if last msg is seen then return
		if (!lastMessage || lastMessage.isSeen) return;
		// Check if the last message is not seen, then update its property only
		if (lastMessage && !lastMessage.isSeen) {
			await Chat.updateOne(
				{ _id: lastMessage._id },
				{ $set: { isSeen: true, seenAt: new Date() } }
			);
			await pusher.trigger(`public-${roomId}`, "messages-seen",
				{ roomId, userId, seenAt: new Date() }
			);
		}
		return res.status(200).json({ message: "Message marked as seen" });
	} catch (error) {
		next(error);
	}
}

/**
 * Add typing indicator
 */
const addTypingIndicator = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { roomId,receiverId } = req.body;
		await pusher.trigger(`public-${roomId}`, "typing-indicator",
			{ roomId,isTyping: true,receiverId } // userId who is typing
		);
		return res.status(200).json({ message: "User is typing" });

	} catch (error) {
		next(error)
	}
}

/**
 * Remove typing indicator
 */
const removeTypingIndicator = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { roomId } = req.body;
		await pusher.trigger(`public-${roomId}`, "typing-indicator",
			{ roomId,isTyping: false}
		);
		return res.status(200).json({ message: "User is not typing" });

	} catch (error) {
		next(error)
	}
}
export { addMessage, addTypingIndicator, deleteMessage, getAllMessages, markMessageRead, removeTypingIndicator };

