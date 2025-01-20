import type { Server as HTTPServer } from "node:http";
import { Server as SocketIOServer } from "socket.io";
import Chat from "../models/messageSchema";

const activeUsers = new Map<string, { userId: string; roomId: string }>(); // Map to track connected users

export const initSocket = (server: HTTPServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*", // Replace with frontend URL in production
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`);

    // Handle user joining a room
    socket.on("join-room", async ({ userId, roomId }) => {
      if (!userId || !roomId) {
        console.error("join-room: Missing userId or roomId");
        return;
      }
      socket.join(roomId);
      activeUsers.set(socket.id, { userId, roomId });
      console.log(`[JOIN] ${userId} joined room ${roomId}`);
    });

    // Handle message sending
    socket.on("send-message", async ({ roomId, message, senderId, receiverId }) => {
      if (!roomId || !message || !senderId || !receiverId) {
        console.error("send-message: Missing roomId, message, senderId, or receiverId");
        return;
      }

      const timestamp = new Date();

      try {
        // Save the message to MongoDB
        const newMessage = new Chat({
          roomId,
          senderId,
          receiverId,
          message,
          timestamp,
        });
        await newMessage.save();

        // Emit message to everyone in the room
        io.to(roomId).emit("receive-message", newMessage);

        console.log(`[MESSAGE] From ${senderId} to ${receiverId} in room ${roomId}: ${message}`);
      } catch (err) {
        console.error("Error saving message:", err);
      }
    });

    // Mark messages as seen
    socket.on("mark-as-seen", async ({ roomId, userId }) => {
      if (!roomId || !userId) {
        console.error("mark-as-seen: Missing roomId or userId");
        return;
      }

      try {
        const lastMessage = await Chat.findOne({ roomId })
          .sort({ timestamp: -1 })
          .lean();

        // if last msg is seen then return
        if (!lastMessage || lastMessage.isSeen) return;

        // Check if the last message is not seen, then update its property only
        if (lastMessage && !lastMessage.isSeen) {
          await Chat.updateOne(
            { _id: lastMessage._id },
            { $set: { isSeen: true, seenAt: new Date() } }
          );

          io.to(roomId).emit("messages-seen", { roomId, userId, timestamp: new Date() });
          console.log(`[SEEN] Last message in room ${roomId} marked as seen by ${userId}`);
        }
      } catch (err) {
        console.error("Error marking messages as seen:", err);
      }
    });


    // Delete message
    socket.on("delete-message", async ({ messageId,roomId,senderId }) => {
      if (!messageId) {
        console.error("delete-message: Missing messageId");
        return;
      }
      try {
        // Delete the message from MongoDB
        // await Chat.deleteOne({ _id: messageId });
        io.to(roomId).emit("message-deleted", { messageId ,senderId});
        console.log(`[DELETE] Message ${messageId} deleted`);
      } catch (err) {
        console.error("Error deleting message:", err);
      }
    })
    // Handle user disconnect
    socket.on("disconnect", () => {
      const user = activeUsers.get(socket.id);
      if (user) {
        console.log(`[DISCONNECT] ${user.userId} left room ${user.roomId}`);
        activeUsers.delete(socket.id);
      }
    });

		// Fetch older messages
		// socket.on("fetch-older-messages", async ({ roomId, lastMessageId }) => {
    //   if(!lastMessageId){
    //     const messages = await Chat.find({ roomId })
		// 		.sort({ timestamp: -1 })
		// 		.limit(20) // Fetch the previous 20 messages, for example
		// 		.lean();
		// 	socket.emit("older-messages", messages);
    //  return;
    //   }
		// 	const messages = await Chat.find({ roomId, _id: { $lt: lastMessageId } })
		// 		.sort({ timestamp: -1 })
		// 		.limit(20) // Fetch the previous 20 messages, for example
		// 		.lean();
    //   console.log(messages);
		// 	socket.emit("older-messages", messages);
		// });
		
  });
};
