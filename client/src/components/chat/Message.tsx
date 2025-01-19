import { useSocket } from "@/context/socketProviders";
import { useUserDetail } from "@/context/userContext";
import { multiFormatDateString } from "@/lib/utils";
import React from "react";

export default function Message() {
	const { messages, isMessagesPending } = useSocket();
	const { userDetails: currentUser } = useUserDetail();
	return (
		<div className="common-container w-full h-full !gap-2">
			{isMessagesPending ? (
				"Loading..."
			) : messages.length === 0 && !isMessagesPending ? (
				<p className="base-light dark:text-light text-center line-clamp-1">
					No messages
				</p>
			) : (
				messages?.map((message, i) => {
					const isSender = message.senderId === currentUser?._id;
					return (
						<React.Fragment key={message._id}>
							<div
								className={`w-full text-left flex items-center  ${isSender ? "justify-end" : "justify-start"}`}
							>
								<p
									className={`px-6 py-3 bg-primary-500 w-fit rounded-xl ${isSender ? "bg-[#f0f5f1]" : "rounded-br-none text-white"} `}
								>
									{message.message}
								</p>
								<br />
							</div>
							{i === messages.length - 1 && isSender && message.isSeen ? (
								<p className="text-end w-full px-6 text-light-3 text-sm !py-0">
									seen at {multiFormatDateString(message.timestamp)}
								</p>
							) : (
								""
							)}
						</React.Fragment>
					);
				})
			)}
		</div>
	);
}