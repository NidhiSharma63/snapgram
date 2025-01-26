import { useToast } from "@/components/ui/use-toast";
import { AppConstants } from "@/constant/keys";
import { type UserDetails, useUserDetail } from "@/context/userContext";
import useAuth from "@/hooks/query/useAuth";
import useMessage from "@/hooks/query/useMessage";
import { getValueFromLS } from "@/lib/utils";
import Pusher from "pusher-js";
import type React from "react";
import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useLocation, useParams } from "react-router-dom";
import type { Socket } from "socket.io-client";

// Define the socket URL
const SOCKET_URL = import.meta.env.VITE_APP_SOCKET_URL;

interface SocketProviderProps {
	children: React.ReactNode;
}

export interface Message {
		message: string;
		senderId: string;
		recipientId: string;
		roomId: string;
		__v: number;
		_id: string;
		seenAt: string;
		isSeen: boolean;
		createdAt: string | Date;
	}
interface SocketProviderState {
	recipient: UserDetails | null;
	roomId: string;
	isMessagesPending: boolean;
	isPending: boolean;
	hasNextPage: boolean;
	isDeletePending: boolean;
	isMsgUploading: boolean;
	isMsgDeleting: boolean;
	setIsMsgDeleting: (val: boolean) => void;
	setIsMsgUploading: (val: boolean) => void;
	socket: Socket | null;
	messages: Message[] | null | undefined;
	setMessages: (messages: Message[] | undefined) => void;
	fetchNextPage: () => void;
	isFetchingNextPage: boolean;
	hasScrolledToBottom: boolean;
	setHasScrolledToBottom: (val: boolean) => void;
	deleteMessage: (params: { messageId: string }) => void;
	containerRef: React.RefObject<HTMLDivElement> | null;
}

const initialState: SocketProviderState = {
	recipient: null,
	roomId: "",
	isMessagesPending: false,
	isPending: false,
	hasNextPage: false,
	isDeletePending: false,
	isMsgUploading: false,
	setIsMsgDeleting: () => {},
	setIsMsgUploading: () => {},
	socket: null,
	messages: null,
	setMessages: () => {},
	fetchNextPage: () => {},
	isFetchingNextPage: false,
	hasScrolledToBottom: false,
	setHasScrolledToBottom: () => {},
	deleteMessage: () => {},
	containerRef: null,
	isMsgDeleting: false,
};

const SocketContext = createContext<SocketProviderState>(initialState);

// RENAME message recieve = received-message
// RENAME timpeStamp ate message seen = seentAt
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const userId = useParams<{ userId: string }>().userId;
	const [messages, setMessages] = useState<Message[] | null | undefined>(null);
	const { useGetUserById } = useAuth();
	const { userDetails: currentUser } = useUserDetail();
	const { toast } = useToast();
	const { data: recipient, isPending } = useGetUserById(userId ?? "");
	const location = useLocation();
	const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
	const [isMsgUploading, setIsMsgUploading] = useState(false);
	const [isMsgDeleting, setIsMsgDeleting] = useState(false);
	const containerRef = useRef<HTMLDivElement | null>(null); // Reference to the message container
	const [pusherInstance, setPusherInstance] = useState<Pusher | null>(null);
	const roomId = useMemo(() => {
		return [currentUser?._id, recipient?._id]
			.sort() // Sort the IDs alphabetically
			.join("-");
	}, [currentUser?._id, recipient?._id]); // Join them with a separator

	const { useGetAllMessages, useDeleteMessage, useMarkMessageAsRead } =
		useMessage();
	const { mutateAsync: deleteMessage, isPending: isDeletePending } =
		useDeleteMessage();
	const { mutateAsync: markMessageAsRead, isPending: isMessageSeenPending } =
		useMarkMessageAsRead();
	// const { data, isPending: isMessagesPending } = useGetAllMessages();
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isPending: isMessagesPending,
	} = useGetAllMessages();

	useEffect(() => {
		// Get user details from local storage
		const storedValue = getValueFromLS(AppConstants.USER_DETAILS);
		const parsedValue = JSON.parse(storedValue as string);

		// Initialize Pusher
		const pusher = new Pusher(import.meta.env.VITE_APP_PUSHER_APP_ID, {
			cluster: import.meta.env.VITE_APP_PUSHER_CLUSTER,
			// authEndpoint: "/pusher/auth", // it is the path to the auth endpoint on the server
			// auth: {
			// 	headers: {
			// 		Authorization: `Bearer ${parsedValue?.tokens?.[0].token}`,
			// 	},
			// },
		});

		// One reason this connection might fail is if the account being over its' limits
		pusher.connection.bind("error", (err) => {
			if (err.data.code === 4004) {
				toast({
					title: "Pusher Error",
					description: "Limit Over! please try again after some time",
				});
			}
		});
		// Store the Pusher instance
		setPusherInstance(pusher);

		// Subscribe to the channel
		const channel = pusher.subscribe(`private-${roomId}`);

		// listen to the event
		// listen for received messages
		channel.bind("message-received", (data: Message) => {
			console.log("Message has been received", data);
			setMessages((prevMessages) => {
				if (!prevMessages) return [data];
				return [...prevMessages, data];
			});

			// add delay to make sure the message is added to the state
			setTimeout(() => {
				if (containerRef.current) {
					containerRef.current.scrollTop = containerRef.current.scrollHeight;
				}
			}, 200);
		});

		// listen for deleted messages
		channel?.bind(
			"message-deleted",
			(data: { messageId: string; senderId: string }) => {
				// console.log("delete message", data);
				if (data.senderId === currentUser?._id) {
					/** cause we are using react query to update the state for current user who has deleted the message */
					return;
				}

				/** but on the receiver side we need to update the state */
				setMessages((prevMessages) => {
					return prevMessages?.filter((message) => {
						return message._id !== data.messageId;
					});
				});
			},
		);

		channel.bind(
			"messages-seen",
			(data: { roomId: string; seentAt: string; userId: string }) => {
				// Update only the last message's `isSeen` property
				setMessages((prevMessages) => {
					if (!prevMessages?.length) return prevMessages; // No messages to update

					// Clone the previous messages to avoid direct mutation
					const updatedMessages = [...prevMessages];

					// Get the last message
					const lastMessage = updatedMessages[updatedMessages.length - 1];

					// Check if the last message belongs to the roomId and is not already seen
					if (lastMessage.roomId === data.roomId && !lastMessage.isSeen) {
						lastMessage.isSeen = true; // Update `isSeen`
						lastMessage.seenAt = data.seentAt; // Add `seenAt` timestamp
					}

					return updatedMessages; // Return the updated messages array
				});
			},
		);

		// Clean up the channel on unmount
		return () => {
			channel.unbind_all();
			channel.unsubscribe();
			pusher.disconnect();
		};
	}, [currentUser, roomId]);

	/** setup socket */
	// useEffect(() => {
	// 	const storedValue = getValueFromLS(AppConstants.USER_DETAILS);
	// 	const parsedValue = JSON.parse(storedValue as string);
	// 	// Connect to Socket.io server
	// 	const newSocket = io(SOCKET_URL, {
	// 		transports: ["websocket", "polling"],
	// 		autoConnect: false, // Initially disconnect
	// 		reconnection: true, // Reconnect automatically
	// 		reconnectionDelay: 1000, // Delay between reconnection attempts
	// 		reconnectionAttempts: 2, // Number of reconnection attempts before giving up
	// 		auth: {
	// 			token: parsedValue?.tokens?.[0].token,
	// 		},
	// 	});

	// 	newSocket.connect();
	// 	setSocket(newSocket);

	// 	// // Clean up socket connection on unmount
	// 	return () => {
	// 		newSocket.disconnect();
	// 	};
	// }, []);

	// Reset when roomId changes

	useEffect(() => {
		if (roomId) {
			setHasScrolledToBottom(false);
		}
	}, [roomId]);

	// only run when data is available
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (isMessagesPending) return;
		if (data) {
			const messages = data?.pages.flat(1)?.reverse();
			setMessages(messages);
		}
	}, [data?.pages, isMessagesPending]);

	// useEffect(() => {
	// 	socket?.on("connect_error", (err) => {
	// 		// console.error("Connection Error:", err.message);
	// 		toast({ title: `Connection Error: ${err.message}` });
	// 	});
	// 	if (!recipient || !currentUser || !socket) return;
	// 	// Handle connection errors
	// 	// Listen for error events
	// 	socket.on("authentication-error", (error) => {
	// 		console.log(error, "error");
	// 		toast({ title: "Something went wrong." });
	// 		return;
	// 	});
	// 	// join room
	// 	socket.emit("join-room", {
	// 		userId,
	// 		roomId,
	// 	});

	// 	socket?.on("error", (data) => {
	// 		toast({ title: data.message });
	// 		return;
	// 	});

	// 	socket?.on("authentication-error", (data) => {
	// 		toast({ title: data.message });
	// 		return;
	// 	});

	// 	socket?.on("receive-message", (data) => {
	// 		setMessages((prevMessages) => {
	// 			if (!prevMessages) return [data];
	// 			return [...prevMessages, data];
	// 		});

	// 		// add delay to make sure the message is added to the state
	// 		setTimeout(() => {
	// 			// setMessages((prevMessages) => [...prevMessages, data]);
	// 			if (containerRef.current) {
	// 				containerRef.current.scrollTop = containerRef.current.scrollHeight;
	// 			}
	// 		}, 200);
	// 	});

	// 	socket?.on("message-deleted", (data) => {
	// 		// console.log("delete message", data);
	// 		if (data.senderId === currentUser._id) {
	// 			/** cause we are using react query to update the state for current user who has deleted the message */
	// 			return;
	// 		}

	// 		/** but on the receiver side we need to update the state */
	// 		setMessages((prevMessages) => {
	// 			return prevMessages?.filter((message) => {
	// 				return message._id !== data.messageId;
	// 			});
	// 		});
	// 	});
	// 	socket.on("disconnect", () => {
	// 		console.log("socket disconnected");
	// 	});
	// }, [
	// 	socket,
	// 	userId,
	// 	recipient,
	// 	currentUser,
	// 	toast,
	// 	roomId,
	// 	// containerRef.current,
	// ]);

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
		if (!pusherInstance || !currentUser || !roomId) return;

		const handleVisibilityChange = () => {
			if (!location.pathname.includes(`/inbox/${userId}`)) {
				return;
			}
			if (!isSentByCurrentUser && !isHasSeenMessage) {
				// Mark messages as seen if user is the receiver
				// Only check for the latest message if it has not been seen
				markMessageAsRead({
					roomId,
					userId: currentUser?._id,
				});
			}
		};

		// Add visibility change event listener
		document.addEventListener("visibilitychange", handleVisibilityChange);

		// Cleanup listener on unmount
		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, [
		markMessageAsRead,
		roomId,
		currentUser,
		isHasSeenMessage,
		isSentByCurrentUser,
		location,
		userId,
		pusherInstance,
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
				isPending,
				fetchNextPage,
				hasNextPage,
				isFetchingNextPage,
				isDeletePending,
				hasScrolledToBottom,
				deleteMessage,
				setHasScrolledToBottom,
				isMsgUploading,
				setIsMsgUploading,
				isMsgDeleting,
				setIsMsgDeleting,
				containerRef,
				setMessages,
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
