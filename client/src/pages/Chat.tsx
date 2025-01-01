import Message from "@/components/chat/Message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSocket } from "@/context/socketProviders";
import { useUserDetail } from "@/context/userContext";
import useAuth from "@/hooks/query/useAuth";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Chat() {
	const { useGetUserById } = useAuth();
  const { userDetails: sender } = useUserDetail();
	const { socket } = useSocket();
	// get user id from params
	const userId = useParams<{ userId: string }>().userId;
	const { data: recipient, isPending } = useGetUserById(userId ?? "");
	const [messages, setMessages] = useState([]);
	const [isMessagesLoading, setIsMessagesLoading] = useState(true);
	const lastMessageId = messages?.[messages.length - 1]?._id;

	useEffect(() => {
		if (!recipient || !sender || !socket) return;
		// join room
		socket.emit("join-room", {
			userId,
			roomId: `${recipient?._id}-${sender?._id}`,
		});

		// fetch all the message first
		socket.on("older-messages", (olderMessages) => {
			console.log(olderMessages, "olderMessages");
			setIsMessagesLoading(false); // Stop loader when messages are received
			if (olderMessages.length > 0) {
				// Update messages in UI
				setMessages((prevMessages) => [...olderMessages, ...prevMessages]);
			}
		});

		fetchOlderMessages();
		return () => {
			socket.disconnect(); // Clean up connection on unmount
		};
	}, [socket, userId, recipient, sender]);

	// Function to fetch older messages
	const fetchOlderMessages = useCallback(() => {
		// if (!lastMessageId) return; // Avoid multiple requests

		setIsMessagesLoading(true); // Start loader
		socket.emit("fetch-older-messages", {
			roomId: `${recipient?._id}-${sender?._id}`,
			lastMessageId,
		}); // Send request to backend
	}, [recipient, sender, lastMessageId, socket]);

	if (!recipient && !isPending) {
		return (
			<div className="common-container !p-0 border-2 border-gray-300 border-black rounded-md">
				<h1>Something went wrong try again</h1>
			</div>
		);
	}
	return (
		<div className="common-container !gap-0 !p-0 border-2 border-gray-300 border-black rounded-md !overflow-hidden">
			<header className="flex items-center justify-start p-4 border-b-2 w-full border-gray-300 border-black gap-4 h-[80px]">
				<img
					src={recipient?.avatar || "/assets/icons/profile-placeholder.svg"}
					alt={recipient?.username}
					className="rounded-full w-12 h-12 object-cover"
				/>
				<p className="base-medium h3-light dark:text-light text-center line-clamp-1">
					{recipient?.username}
				</p>
			</header>
			<Message />
			<div className="flex items-center justify-between p-4 h-[60px] w-full gap-4">
				<Textarea
					className="shad-textarea custom-scrollbar textarea-field-chat"
					placeholder="Type a message here..."
				/>
				<Button className="btn btn-primary">Send</Button>
			</div>
		</div>
	);
}