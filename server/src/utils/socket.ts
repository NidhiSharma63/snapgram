import type { Server as HTTPServer } from "node:http";
import { Server as SocketIOServer } from "socket.io";

const activeUsers = new Map(); // Map to track connected users

export const initSocket = (server: HTTPServer) => {
	const io = new SocketIOServer(server, {
		cors: {
			origin: "*", // Set to specific frontend URL in production
			methods: ["GET", "POST"],
		},
	});

	io.on("connection", (socket) => {
		console.log("A user connected:", socket.id);

		// Handle user joining with a room ID
		socket.on("join-room", ({ userId, roomId }) => {
			socket.join(roomId); // Add user to the room
			activeUsers.set(socket.id, { userId, roomId });
			console.log(`${userId} joined room: ${roomId}`);
		});

		// Handle receiving a message
		socket.on("send-message", ({ roomId, message, userId }) => {
			const timestamp = new Date().toISOString();

			// Emit message to everyone in the room
			io.to(roomId).emit("receive-message", { message, userId, timestamp });
			console.log(`Message from ${userId} in room ${roomId}:`, message);
		});

		// Handle user disconnect
		socket.on("disconnect", () => {
			const user = activeUsers.get(socket.id);
			if (user) {
				console.log(`${user.userId} disconnected from room ${user.roomId}`);
				activeUsers.delete(socket.id);
			}
		});
	});
};
