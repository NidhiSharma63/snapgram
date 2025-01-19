import { useToast } from "@/components/ui/use-toast";
import { AppConstants } from "@/constant/keys";
import { useUserDetail } from "@/context/userContext";
import useAuth from "@/hooks/query/useAuth";
import useMessage from "@/hooks/query/useMessage";
import { getValueFromLS } from "@/lib/utils";
import type React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { type Socket, io } from "socket.io-client";

// Define the socket URL
const SOCKET_URL = import.meta.env.VITE_APP_SOCKET_URL;
const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
	children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [messages, setMessages] = useState([]);
	const { useGetUserById } = useAuth();
	const { userDetails: currentUser } = useUserDetail();
	const { toast } = useToast();
	const [userId, setUserId] = useState<string | null>(null);
	const { data: recipient, isPending } = useGetUserById(userId ?? "");
	const lastMessageId = messages?.[messages.length - 1]?._id;
	const roomId = useMemo(() => {
		return [currentUser?._id, recipient?._id]
			.sort() // Sort the IDs alphabetically
			.join("-");
	}, [currentUser?._id, recipient?._id]); // Join them with a separator

	const { useGetAllMessages } = useMessage(roomId, lastMessageId ?? "");
	const { data, isPending: isMessagesPending } = useGetAllMessages();

	// check if current user is recipient
	const isRecipient = recipient?._id === currentUser?._id;

	useEffect(() => {
		const storedValue = getValueFromLS(AppConstants.USER_DETAILS);
		const parsedValue = JSON.parse(storedValue as string);
		// Connect to Socket.io server
		const newSocket = io(SOCKET_URL, {
			transports: ["websocket"], // Recommended for production
			autoConnect: false, // Initially disconnect
			reconnection: true, // Reconnect automatically
			reconnectionDelay: 1000, // Delay between reconnection attempts
			reconnectionAttempts: 2, // Number of reconnection attempts before giving up
			auth: {
				token: parsedValue?.tokens?.[0].token,
			},
		});

		newSocket.connect();
		setSocket(newSocket);

		// // Clean up socket connection on unmount
		return () => {
			newSocket.disconnect();
		};
	}, []);

	// only run once
	useEffect(() => {
		if (data) {
			setMessages(data);
		}
	}, [data]);

	useEffect(() => {
		// console.log("did i run really", recipient, currentUser, socket);
		if (!recipient || !currentUser || !socket) return;
		// Listen for error events
		socket.on("authentication-error", (error) => {
			console.log(error, "error");
			toast({ title: "Something went wrong." });
			return;
		});
		// join room
		socket.emit("join-room", {
			userId,
			roomId,
		});

		// // fetch all the message first
		// socket.on("older-messages", (olderMessages) => {
		// 	// console.log(olderMessages, "olderMessages");
		// 	setIsMessagesLoading(false); // Stop loader when messages are received
		// 	console.log("oldermes", olderMessages);
		// 	if (olderMessages.length > 0) {
		// 		// Update messages in UI
		// 		setMessages((prevMessages) => [...olderMessages, ...prevMessages]);
		// 	}
		// });

		socket?.on("error", (data) => {
			toast({ title: data.message });
			return;
		});

		socket?.on("authentication-error", (data) => {
			toast({ title: data.message });
			return;
		});

		socket?.on("receive-message", (data) => {
			// console.log("receive-message", data);
			setMessages((prevMessages) => [...prevMessages, data]);
		});

		socket.on("disconnect", () => {
			console.log("socket disconnected");
		});
		// fetchOlderMessages();
	}, [socket, userId, recipient, currentUser, toast, roomId]);

	/**
	 * This section handles the logic for sending and receiving messages.
	 */
	// listen to new message event if the user is the recipient
	// if (isRecipient) {
	// 	socket?.on("receive-message", (data) => {
	// 		setMessages((prevMessages) => [...prevMessages, data]);
	// 		console.log("receive-message", data);
	// 	});
	// }

	// // listen to send message event if the user is not the recipient
	// if (!isRecipient) {
	// 	socket?.on("send-message", (data) => {
	// 		setMessages((prevMessages) => [...prevMessages, data]);
	// 		console.log("Sender has send the message", data);
	// 	});
	// }
	/**
	 * This section handles the logic for managing seen messages.
	 * It ensures that messages are marked as seen when the chat window is in focus
	 * and the current user is the receiver of the messages.
	 * It also listens for seen messages and updates the UI to show that the messages are seen by the receiver.
	 */

	// check if chat window is open and is in focus
	// if yes then mark messages as seen in the chat window if user is receiver
	useEffect(() => {
		if (!socket || !currentUser || !roomId) return;
		if (document.visibilityState === "visible") {
			if (isRecipient) {
				socket.emit("mark-as-seen", {
					roomId,
					userId: currentUser?._id,
				});
			}
		}
	}, [socket, roomId, currentUser, isRecipient]);

	/**
	 * End of seen messages logic
	 */

	return (
		<SocketContext.Provider
			value={{
				socket,
				recipient,
				roomId,
				isMessagesPending,
				messages,
				setUserId,
				isPending,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
};

// Custom hook to use socket context
export const useSocket = () => {
	const socket = useContext(SocketContext);

	if (!socket) {
		throw new Error("useSocket must be used within a SocketProvider");
	}

	return socket;
};
