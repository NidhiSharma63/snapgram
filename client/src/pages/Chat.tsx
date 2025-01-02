import Message from "@/components/chat/Message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSocket } from "@/context/socketProviders";
import { useUserDetail } from "@/context/userContext";
import { type SetStateAction, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Todo - fix authentication error issue
export default function Chat() {
	const { socket, recipient, roomId, isPending, setUserId } = useSocket();
	const { userDetails: currentUser } = useUserDetail();
	const [userMessage, setUserMessage] = useState("");
	const userId = useParams<{ userId: string }>().userId;

	useEffect(() => {
		// if (recipient) {
		setUserId(userId);
		// }
	}, [userId, setUserId]);

	// handle message change
	const handleMessageChange = useCallback(
		(e: { target: { value: SetStateAction<string> } }) => {
			setUserMessage(e.target.value);
		},
		[],
	);

	// handle send message
	const handleSendMessage = useCallback(() => {
		if (!recipient || !currentUser || !socket) return;
		socket.emit("send-message", {
			roomId,
			currentUserId: currentUser?._id,
			receiverId: recipient?._id,
			message: userMessage,
			timestamp: new Date(),
		});
		setUserMessage("");
	}, [recipient, currentUser, userMessage, socket, roomId]);

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
					value={userMessage}
					onChange={handleMessageChange}
				/>
				<Button className="btn btn-primary" onClick={handleSendMessage}>
					Send
				</Button>
			</div>
		</div>
	);
}
