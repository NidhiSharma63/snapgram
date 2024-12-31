import type { Server as HTTPServer } from "node:http";
import { Server as SocketIOServer } from "socket.io";
import Chat from "../models/messageSchema"; // Assuming chatSchema is in models/chatModel.ts

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
        io.to(roomId).emit("receive-message", {
          roomId,
          senderId,
          receiverId,
          message,
          timestamp,
        });

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
        // Update all messages in the room as seen by the user
        await Chat.updateMany(
          { roomId, receiverId: userId, isSeen: false },
          { $set: { isSeen: true, seenAt: new Date() } }
        );

        io.to(roomId).emit("messages-seen", { roomId, userId, timestamp: new Date() });
        console.log(`[SEEN] Messages in room ${roomId} marked as seen by ${userId}`);
      } catch (err) {
        console.error("Error marking messages as seen:", err);
      }
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
      const user = activeUsers.get(socket.id);
      if (user) {
        console.log(`[DISCONNECT] ${user.userId} left room ${user.roomId}`);
        activeUsers.delete(socket.id);
      }
    });

		// Fetch older messages
		socket.on("fetch-older-messages", async ({ roomId, lastMessageId }) => {
			const messages = await Chat.find({ roomId, _id: { $lt: lastMessageId } })
				.sort({ timestamp: -1 })
				.limit(20) // Fetch the previous 20 messages, for example
				.lean();
		
			socket.emit("older-messages", messages);
		});
		
  });
};
