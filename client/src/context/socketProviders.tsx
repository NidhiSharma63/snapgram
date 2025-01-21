import { useToast } from "@/components/ui/use-toast";
import { AppConstants } from "@/constant/keys";
import { useUserDetail } from "@/context/userContext";
import useAuth from "@/hooks/query/useAuth";
import useMessage from "@/hooks/query/useMessage";
import { getValueFromLS } from "@/lib/utils";
import type React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
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
	const location = useLocation();
	const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
	const [isMsgUploading, setIsMsgUploading] = useState(false);
	const [isMsgDeleting, setIsMsgDeleting] = useState(false);
	const roomId = useMemo(() => {
		return [currentUser?._id, recipient?._id]
			.sort() // Sort the IDs alphabetically
			.join("-");
	}, [currentUser?._id, recipient?._id]); // Join them with a separator

	const { useGetAllMessages, useDeleteMessage } = useMessage(
		roomId,
		lastMessageId ?? "",
	);
	const { mutateAsync: deleteMessage, isPending: isDeletePending } =
		useDeleteMessage();
	// const { data, isPending: isMessagesPending } = useGetAllMessages();
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isPending: isMessagesPending,
	} = useGetAllMessages();

	/** setup socket */
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

// Reset when roomId changes
	useEffect(() => {
		if (roomId) {
			setHasScrolledToBottom(false);
		}
	}, [roomId]);

	// only run when data is available
	useEffect(() => {
		// console.log("pending state");
		if (isMessagesPending) return;
		if (data) {
			// console.log("The data has changed!", data?.pages.flat(1));
			const messages = data?.pages.flat(1)?.reverse();
			setMessages(messages);
		}
	}, [data?.pages, isMessagesPending]);

	useEffect(() => {
		socket?.on("connect_error", (err) => {
			console.error("Connection Error:", err.message);
			toast({ title: `Connection Error: ${err.message}` });
		});
		if (!recipient || !currentUser || !socket) return;
		// Handle connection errors
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

		socket?.on("error", (data) => {
			toast({ title: data.message });
			return;
		});

		socket?.on("authentication-error", (data) => {
			toast({ title: data.message });
			return;
		});

		socket?.on("receive-message", (data) => {
			console.log("msg rec");
			setMessages((prevMessages) => [...prevMessages, data]);
		});

		socket?.on("message-deleted", (data) => {
			// console.log("delete message", data);
			if (data.senderId === currentUser._id) {
				/** cause we are using react query to update the state for current user who has deleted the message */
				return;
			}

			/** but on the receiver side we need to update the state */
			setMessages((prevMessages) => {
				return prevMessages.filter((message) => {
					return message._id !== data.messageId;
				});
			});
		});
		socket.on("disconnect", () => {
			console.log("socket disconnected");
		});
	}, [socket, userId, recipient, currentUser, toast, roomId]);


	const isHasSeenMessage = useMemo(() => {
		return messages?.[messages.length - 1]?.isSeen === true;
	}, [messages]);

	/** if the last msg is sent by the current user then it should not be receiver but
	 */
	const isSentByCurrentUser = useMemo(() => {
		return messages?.[messages.length - 1]?.senderId === currentUser?._id;
	}, [messages, currentUser]);

	// check if chat window is open and is in focus
	// if yes then mark messages as seen in the chat window if user is receiver
	useEffect(() => {
		if (!socket || !currentUser || !roomId) return;

		const handleVisibilityChange = () => {
			if (!location.pathname.includes(`/inbox/${userId}`)) {
				return;
			}
			if (!isSentByCurrentUser && !isHasSeenMessage) {
				// Mark messages as seen if user is the receiver
				// Only check for the latest message if it has not been seen
				socket.emit("mark-as-seen", {
					roomId,
					userId: currentUser?._id,
				});
			}
			socket.on("messages-seen", (data) => {
				// Update only the last message's `isSeen` property
				setMessages((prevMessages) => {
					if (!prevMessages.length) return prevMessages; // No messages to update

					// Clone the previous messages to avoid direct mutation
					const updatedMessages = [...prevMessages];

					// Get the last message
					const lastMessage = updatedMessages[updatedMessages.length - 1];

					// Check if the last message belongs to the roomId and is not already seen
					if (lastMessage.roomId === data.roomId && !lastMessage.isSeen) {
						lastMessage.isSeen = true; // Update `isSeen`
						lastMessage.seenAt = data.timestamp; // Add `seenAt` timestamp
					}

					return updatedMessages; // Return the updated messages array
				});
			});
		};

		// Add visibility change event listener
		document.addEventListener("visibilitychange", handleVisibilityChange);

		// Cleanup listener on unmount
		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, [
		socket,
		roomId,
		currentUser,
		isHasSeenMessage,
		isSentByCurrentUser,
		location,
		userId,
	]);
	

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
				fetchNextPage,
				hasNextPage,
				isFetchingNextPage,
				deleteMessage,
				isDeletePending,
				hasScrolledToBottom,
				setHasScrolledToBottom,
				isMsgUploading,
				setIsMsgUploading,
				isMsgDeleting,
				setIsMsgDeleting,
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
