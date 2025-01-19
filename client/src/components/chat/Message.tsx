import { useSocket } from "@/context/socketProviders";
import { useUserDetail } from "@/context/userContext";

export default function Message() {
	const { messages, isMessagesPending } = useSocket();
	const { userDetails: currentUser } = useUserDetail();
	return (
		<div className="common-container w-full h-full !gap-2">
			{isMessagesPending ? (
				"Loading..."
			) : messages.length === 0 ? (
				<p className="base-light dark:text-light text-center line-clamp-1">
					No messages
				</p>
			) : (
				messages?.map((message) => {
					const isSender = message.senderId === currentUser?._id;
					return (
						<div
							key={message._id}
							className={`w-full text-left flex items-center ${isSender ? "justify-end" : "justify-start"}`}
						>
							<p
								className={`px-6 py-3 bg-primary-500 w-fit rounded-xl ${isSender ? "bg-[#f0f5f1]" : "rounded-br-none text-white"} `}
							>
								{message.message}
							</p>
						</div>
					);
				})
			)}
		</div>
	);
}