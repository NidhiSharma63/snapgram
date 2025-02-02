import { useToast } from "@/components/ui/use-toast";
import type { IUser } from "@/constant/interfaces";
import { type UserDetails, useUserDetail } from "@/context/userContext";
import useAuth from "@/hooks/query/useAuth";
import useMessage from "@/hooks/query/useMessage";
import Pusher from "pusher-js";
import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

interface SocketProviderProps {
	children: React.ReactNode;
}

export interface IMessage {
		message: string;
		senderId: string;
		receiverId: string;
		roomId: string;
		__v: number;
		_id: string;
		seenAt: string;
		isSeen: boolean;
		createdAt: string | Date;
		replyText?: string;
		isDummy?: boolean;
	}
interface SocketProviderState {
	recipient: UserDetails | null;
	roomId: string;
	isPending: boolean;
	isMsgUploading: boolean;
	isMsgDeleting: boolean;
	setIsMsgDeleting: (val: boolean) => void;
	setIsMsgUploading: (val: boolean) => void;
	messages: IMessage[] | null | undefined;
	setMessages: (messages: IMessage[] | undefined) => void;
	hasScrolledToBottom: boolean;
	setHasScrolledToBottom: (val: boolean) => void;
	containerRef: React.RefObject<HTMLDivElement> | null;
	unSeenMsgs: IMessage[] | [];
	setUnSeenMsgs: (val: IMessage[]) => void;
	replyText: string;
	setReplyText: (val: string) => void;
}

const initialState: SocketProviderState = {
	recipient: null,
	roomId: "",
	isPending: false,
	isMsgUploading: false,
	setIsMsgDeleting: () => {},
	setIsMsgUploading: () => {},
	messages: null,
	setMessages: () => {},
	hasScrolledToBottom: false,
	setHasScrolledToBottom: () => {},
	containerRef: null,
	isMsgDeleting: false,
	unSeenMsgs: [],
	setUnSeenMsgs: () => {},
	replyText: "",
	setReplyText: () => {},
};

const SocketContext = createContext<SocketProviderState>(initialState);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
	const userId = useParams<{ userId: string }>().userId;
	const [messages, setMessages] = useState<IMessage[] | undefined>([]);
	const { useGetUserById, useGetAllUser } = useAuth();
	const { data: allUsers } = useGetAllUser();
	const { userDetails: currentUser } = useUserDetail();
	const { toast } = useToast();
	const { data: recipient, isPending } = useGetUserById(userId ?? "");
	const location = useLocation();
	const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
	const [isMsgUploading, setIsMsgUploading] = useState(false);
	const [isMsgDeleting, setIsMsgDeleting] = useState(false);
	const containerRef = useRef<HTMLDivElement | null>(null); // Reference to the message container
	const [pusherInstance, setPusherInstance] = useState<Pusher | null>(null);
	const navigate = useNavigate();
	const [unSeenMsgs, setUnSeenMsgs] = useState<IMessage[]>([]);
	const [replyText, setReplyText] = useState("");
	const roomId = useMemo(() => {
		return [currentUser?._id, recipient?._id]
			.sort() // Sort the IDs alphabetically
			.join("-"); // Join them with a separator
	}, [currentUser?._id, recipient?._id]);

	const { useMarkMessageAsRead } = useMessage();
	const { mutateAsync: markMessageAsRead } = useMarkMessageAsRead();

	// notify
	const notify = useCallback(
		(message: IMessage) => {
			/**
			 * get all users
			 */
			const user = allUsers?.find(
				(user: IUser) => user._id === message.senderId,
			);
			// Play sound when notification shows
			const audio = new Audio("/assets/notify.mp3");
			// Reset the audio to ensure it plays every time
			audio.load();
			audio.play().catch((error) => {
				// Handle error if audio doesn't play, e.g., due to browser policy
				console.error("Audio play error: ", error);
			});

			toast({
				title: `you have a new message from ${user?.username}`,
				description: message.message.includes(
					"https://firebasestorage.googleapis.com",
				)
					? "Image"
					: message.message,
				onClick: (e) => {
					e.stopPropagation();
					navigate(`/inbox/${message?.senderId}`);
				},
				style: {
					cursor: "pointer",
				},
			});
		},
		[toast, allUsers, navigate],
	);
	// Initialize Pusher
	useEffect(() => {
		const pusher = new Pusher(import.meta.env.VITE_APP_PUSHER_APP_ID, {
			cluster: import.meta.env.VITE_APP_PUSHER_CLUSTER,
		});

		// One reason this connection might fail is if the account being over its' limits
		pusher.connection.bind("error", (err: { data: { code: number } }) => {
			if (err.data.code === 4004) {
				toast({
					title: "Pusher Error",
					description: "Limit Over! please try again after some time",
				});
			}
		});
		// Store the Pusher instance
		setPusherInstance(pusher);
		console.log("pusher connected");
		// Return the cleanup function to disconnect Pusher when unmounting
		return () => {
			pusher.disconnect();
		};
	}, [toast]);

	useEffect(() => {
		if (!pusherInstance) return;
		/**
		 * access all channels
		 */

		// Subscribe to the channel
		const channel = pusherInstance.subscribe(`public-${roomId}`);
		const notificationChannel = pusherInstance.subscribe(
			`notification-${currentUser?._id}`,
		);

		/**
		 * listen for unread notifications
		 */
		notificationChannel.bind("unread-message", (data: IMessage) => {
			// check if user is the sender
			if (data.senderId === currentUser?._id) return;

			// check if user has already opened the chat
			if (userId === data.senderId) return;

			notify(data);
			setUnSeenMsgs((prev) => [...prev, data]);
		});
		// listen to the event
		// listen for received messages
		channel.bind("message-received", (data: IMessage) => {
			setMessages((prevMessages) => {
				if (!prevMessages) return [data];

				/**
				 * remove the dummy msg if exists which was added while sending the msg
				 */
				const removeDummy = prevMessages.find(
					(msg: IMessage) => msg.isDummy === true,
				)
					? prevMessages.filter((msg: IMessage) => msg.isDummy !== true)
					: prevMessages;
				return [...removeDummy, data];
			});
			if (containerRef.current) {
				// console.log("Msg Received dude");
				containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
			}
		});

		// listen for deleted messages
		channel?.bind(
			"message-deleted",
			(data: { messageId: string; senderId: string }) => {
				// console.log("delete message", data);
				// if (data.senderId === currentUser?._id) {
				// 	/** cause we are using react query to update the state for current user who has deleted the message */
				// 	return;
				// }

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
			// console.warn("Unsubscribing from channel");
			channel.unbind_all();
			pusherInstance.unsubscribe(`notification-${currentUser?._id}`);
			channel.unsubscribe();
		};
	}, [currentUser, roomId, pusherInstance, notify, userId]);

	useEffect(() => {
		if (roomId) {
			setHasScrolledToBottom(false);
		}
	}, [roomId]);

	// only run when data is available
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	// useEffect(() => {
	// 	if (isMessagesPending) return;
	// 	const messages = data?.pages.flat(1)?.reverse();
	// 	setMessages(messages);
	// }, [data?.pages, isMessagesPending]);

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
				setUnSeenMsgs([]);
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
				unSeenMsgs,
				recipient,
				roomId,
				messages,
				isPending,
				hasScrolledToBottom,
				setHasScrolledToBottom,
				isMsgUploading,
				setIsMsgUploading,
				isMsgDeleting,
				setIsMsgDeleting,
				containerRef,
				setMessages,
				setUnSeenMsgs,
				replyText,
				setReplyText,
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
