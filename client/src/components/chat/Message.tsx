import { useSocket } from "@/context/socketProviders";
import { useUserDetail } from "@/context/userContext";
import { multiFormatDateString } from "@/lib/utils";
import React, { useCallback, useEffect, useRef } from "react";

export default function Message() {
	const {
		messages,
		isMessagesPending,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useSocket();
	const { userDetails: currentUser } = useUserDetail();
	const containerRef = useRef(null); // Reference to the message container
	//
	/**
	 * scroll to the latest msg when chat window opens
	 */
	useEffect(() => {
		if (isMessagesPending) return;
		if (messages?.length > 20) return;
		const lastMsg = messages?.[messages.length - 1]?.message;
		// biome-ignore lint/complexity/noForEach: <explanation>
		document.querySelectorAll(".user-msg").forEach((element) => {
			if (element.textContent === lastMsg) {
				element.scrollIntoView({
					behavior: "smooth",
				});
			}
		});
	}, [isMessagesPending, messages]);

	const loadMoreMessages = useCallback(() => {
		if (
			containerRef?.current?.scrollTop === 0 &&
			hasNextPage &&
			!isFetchingNextPage
		) {
			fetchNextPage(); // Fetch the next set of messages
		}
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);
	return (
		<div
			className="common-container w-full h-full !gap-2"
			onScroll={loadMoreMessages}
			ref={containerRef}
		>
			{isFetchingNextPage && "Loading..."}
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
									className={`user-msg px-6 py-3 bg-primary-500 w-fit rounded-xl ${isSender ? "!bg-[#f0f5f1]" : "rounded-br-none text-white"} `}
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