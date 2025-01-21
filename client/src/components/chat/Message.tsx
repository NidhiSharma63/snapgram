import { Skeleton } from "@/components/ui/skeleton";
import { useSocket } from "@/context/socketProviders";
import { useTheme } from "@/context/themeProviders";
import { useUserDetail } from "@/context/userContext";
import { storage } from "@/firebase/config";
import { multiFormatDateString } from "@/lib/utils";
import { deleteObject, ref } from "firebase/storage";
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
		socket,
		roomId,
		setIsMsgDeleting,
		isMsgDeleting,
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
		const lastMsg = messages?.[messages.length - 1]?.message;
		// biome-ignore lint/complexity/noForEach: <explanation>
		document
			.querySelectorAll(".user-msg")
			.forEach((element) => {
				if (element.textContent === lastMsg) {
					element.scrollIntoView({
						behavior: "smooth",
					});
					setHasScrolledToBottom(true);
				}
			});
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
		async (event) => {
			const text = event.target.dataset.id;
			setIsMsgDeleting(true);
			// extract image from message
			const isImage = text.startsWith("https://firebasestorage.googleapis.com");
			const messageId = isImage
				? messages.find((item) => {
						// console.log("msg", item.message, "text", text);
						return item.message === text;
					})?._id
				: event.target.dataset.id;

			// delete image from firebase
			if (isImage) {
				const storageRef = ref(storage, text);
				await deleteObject(storageRef);
			}
			setDeleteMsgId(messageId);
			await deleteMessage({
				messageId,
			});
			socket.emit("delete-message", {
				messageId,
				roomId,
				senderId: currentUser?._id,
			});
			setIsMsgDeleting(false);
		},
		[deleteMessage, socket, roomId, currentUser, messages, setIsMsgDeleting],
	);

	return (
		<div
			className="common-container w-full h-full !gap-2 !py-1"
			onScroll={loadMoreMessages}
			ref={containerRef}
		>
			{isFetchingNextPage && (
				<p className="base-light dark:text-light lg:text-lg text-xs text-center line-clamp-1">
					Loading...
				</p>
			)}
			{isMessagesPending ? (
				// <p className="base-light dark:text-light lg:text-lg text-xs text-center line-clamp-1">
				Array(5)
					.fill("")
					.map((_, i) => (
						<div
							key={i}
							className={`flex items-center ${i % 2 === 0 ? "justify-end" : "justify-start"} space-x-4 w-full`}
						>
							<Skeleton className="h-12 w-12 rounded-full" />
							<div className="space-y-2">
								<Skeleton className="h-4 w-[250px]" />
								<Skeleton className="h-4 w-[200px]" />
							</div>
						</div>
					))
				// </p>
			) : messages?.length === 0 && !isMessagesPending ? (
				<p className="base-light dark:text-light lg:text-lg text-xs text-center line-clamp-1">
					Start your conversation with your friend
				</p>
			) : (
				messages?.map((message, i) => {
					const isSender = message.senderId === currentUser?._id;
					// if message is a url then create the image otherwise show the text
					// check if message is a url created by firebase
					const isImage = message.message.startsWith(
						"https://firebasestorage.googleapis.com",
					);

					return (
						<React.Fragment key={message._id}>
							<div
								className={`w-full text-left flex items-center gap-3 ${isSender ? "justify-end" : "justify-start"} group`}
							>
								{/* show loader only for that message which is being deleted by user */}
								{isSender && isMsgDeleting && deleteMsgId === message._id && (
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
								{isSender && deleteMsgId !== message._id && !isMsgDeleting && (
									<img
										data-id={isImage ? message.message : message._id}
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
								{isImage ? (
									<img
										src={message.message}
										loading="lazy"
										alt="message"
										className="lg:max-w-[500px] max-w-[200px] max-h-[200px] lg:max-h-[500px] object-cover rounded-md"
									/>
								) : (
									<p
										className={`user-msg lg:text-lg text-xs px-6 py-3 bg-primary-500 w-fit rounded-xl ${isSender ? (theme === "dark" ? "!bg-[#1f1f1f]" : "!bg-[#f0f5f1]") : "rounded-br-none text-white"} `}
									>
										{message.message}
									</p>
								)}

								<br />
							</div>
							{i === messages.length - 1 && isSender && message.isSeen ? (
								<p className="text-end w-full px-6 text-light-3  lg:text-md text-xs !py-0">
									seen at {multiFormatDateString(message.seenAt)}
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