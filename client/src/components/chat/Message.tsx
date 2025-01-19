import { useSocket } from "@/context/socketProviders";
import { useTheme } from "@/context/themeProviders";
import { useUserDetail } from "@/context/userContext";
import { multiFormatDateString } from "@/lib/utils";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ColorRing } from "react-loader-spinner";

export default function Message() {
	const {
		messages,
		isMessagesPending,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		deleteMessage,
		isDeletePending,
		hasScrolledToBottom,
		setHasScrolledToBottom,
	} = useSocket();
	const { userDetails: currentUser } = useUserDetail();
	const { theme } = useTheme();
	const [deleteMsgId, setDeleteMsgId] = useState("");
	const containerRef = useRef(null); // Reference to the message container
	/**
	 * scroll to the latest msg when chat window opens
	 */
	useEffect(() => {
		if (isMessagesPending || hasScrolledToBottom) return;
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
		setHasScrolledToBottom(true);
	}, [
		isMessagesPending,
		messages,
		hasScrolledToBottom,
		setHasScrolledToBottom,
	]);

	
	const loadMoreMessages = useCallback(() => {
		if (
			containerRef?.current?.scrollTop === 0 &&
			hasNextPage &&
			!isFetchingNextPage
		) {
			fetchNextPage(); // Fetch the next set of messages
		}
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	const handleDeleteMessage = useCallback(
		(event) => {
			// console.log("message id", event.target.dataset.id);
			deleteMessage({
				messageId: event.target.dataset.id,
			});
			setDeleteMsgId(event.target.dataset.id);
		},
		[deleteMessage],
	);
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
								className={`w-full text-left flex items-center gap-3 ${isSender ? "justify-end" : "justify-start"} group`}
							>
								{/* show loader only for that message which is being deleted by user */}
								{isSender && isDeletePending && deleteMsgId === message._id && (
									<ColorRing
										width={24}
										height={24}
										colors={
											theme === "dark"
												? ["#fff", "#fff", "#fff", "#fff", "#fff"]
												: [
														"#e3e2de",
														"#e3e2de",
														"#e3e2de",
														"#e3e2de",
														"#e3e2de",
													]
										}
									/>
								)}
								{isSender &&
									deleteMsgId !== message._id &&
									!isDeletePending && (
										<img
											data-id={message._id}
											onClick={handleDeleteMessage}
											src={"/assets/icons/delete.svg"}
											alt="delete"
											width={14}
											height={14}
											style={{
												cursor: "pointer",
											}}
											className="hidden group-hover:block cursor-pointer"
										/>
									)}
								<p
									className={`user-msg px-6 py-3 bg-primary-500 w-fit rounded-xl ${isSender ? (theme === "dark" ? "!bg-[#1f1f1f]" : "!bg-[#f0f5f1]") : "rounded-br-none text-white"} `}
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