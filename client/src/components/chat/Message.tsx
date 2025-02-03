import UserMsg from "@/components/chat/UserMsg";
import { Skeleton } from "@/components/ui/skeleton";
import { type IMessage, useSocket } from "@/context/socketProviders";
import { useTheme } from "@/context/themeProviders";
import { useUserDetail } from "@/context/userContext";
import { storage } from "@/firebase/config";
import useMessage from "@/hooks/query/useMessage";
import { multiFormatDateString } from "@/lib/utils";
import { deleteObject, ref } from "firebase/storage";
import React, { useCallback, useEffect, useState } from "react";


export default function Message() {
	const {
		messages,
		hasScrolledToBottom,
		setHasScrolledToBottom,
		roomId,
		setIsMsgDeleting,
		isMsgDeleting,
		containerRef,
		setMessages,
		setReplyText,
	} = useSocket();
	const { userDetails: currentUser } = useUserDetail();
	const { theme } = useTheme();
	const [deleteMsgId, setDeleteMsgId] = useState("");
	const { useDeleteMessage, useGetAllMessages } = useMessage();
	const { mutateAsync: deleteMessage, isError } = useDeleteMessage();

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isPending: isMessagesPending,
	} = useGetAllMessages(roomId);
	// only run when data is available
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const pages = data?.pages;
		let newMessages: IMessage[] = [];
		if (pages?.length === 1) {
			// If only one page is present then get all msgs
			newMessages = pages?.at(0) ?? [];
		} else if (pages && pages?.length > 1) {
			// But if more then one page is present the get the
			// data from last one cause its the latest and other have already been fetched and added in the state
			newMessages = pages?.slice(-1).flat() ?? [];
		}
		if (!newMessages.length) return;

		// Filter out messages that are already present
		// @ts-ignore
		setMessages((prev) => {
			// Make sure prev is handled as IMessage[] or undefined
			const existingIds = new Set(prev?.map((msg: IMessage) => msg._id) || []); // Handle prev being possibly undefined
			const filteredNewMessages = newMessages.filter(
				(msg) => !existingIds.has(msg._id),
			);

			// Return the updated array with new messages at the top and previous ones below
			return [...filteredNewMessages.reverse(), ...(prev || [])];
		});
	}, [data?.pages, isMessagesPending]);
	/**
	 * on Error reset state
	 */

	useEffect(() => {
		if (isError) {
			setDeleteMsgId("");
			setIsMsgDeleting(false);
		}
	}, [isError, setIsMsgDeleting]);
	/**
	 * scroll to the latest msg when chat window opens
	 */
	useEffect(() => {
		if (isMessagesPending || hasScrolledToBottom) return;
		const lastMsg = messages?.[messages.length - 1]?.message;
		// biome-ignore lint/complexity/noForEach: <explanation>
		document.querySelectorAll(".user-msg").forEach((element) => {
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
	}, [hasNextPage, isFetchingNextPage, fetchNextPage, containerRef?.current]);

	const handleDeleteMessage = useCallback(
		async (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
			const text = event.currentTarget.dataset.id;
			setIsMsgDeleting(true);
			// extract image from message
			const isImage = text?.startsWith(
				"https://firebasestorage.googleapis.com",
			);
			const messageId = isImage
				? messages?.find((item) => {
						return item.message === text;
					})?._id
				: event.currentTarget.dataset.id;

			// delete image from firebase
			if (isImage) {
				const storageRef = ref(storage, text);
				await deleteObject(storageRef);
			}
			setDeleteMsgId(messageId ?? "");
			await deleteMessage({
				messageId: messageId ?? "",
				roomId: roomId ?? "",
			});
			setIsMsgDeleting(false);
		},
		[deleteMessage, roomId, messages, setIsMsgDeleting],
	);

	/**
	 * handle Click On Reply
	 */
	const handleClickOnReply = useCallback(
		(event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
			const text = event.currentTarget.dataset.id;
			// // extract image from message
			const isImage = text?.startsWith(
				"https://firebasestorage.googleapis.com",
			);
			const message = isImage
				? messages?.find((item) => {
						return item.message === text;
					})?.message
				: messages?.find((item) => {
						return item._id === text;
					})?.message;
			setReplyText(message ?? "");

			// move container to bottom
			containerRef?.current?.scroll({
				top: containerRef?.current?.scrollHeight,
			});
		},
		[messages, setReplyText, containerRef?.current],
	);

	/**
	 * handle onchange
	 */
	const handleOnChange = useCallback(() => {
		
	}, []);
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
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
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
								className={`w-full text-left flex  gap-3 ${isSender ? "justify-end" : "justify-start"} group`}
							>
								<UserMsg
									isSender={isSender}
									isMsgDeleting={isMsgDeleting}
									deleteMsgId={deleteMsgId}
									message={message}
									isImage={isImage}
									theme={theme}
									handleDeleteMessage={handleDeleteMessage}
									handleClickOnReply={handleClickOnReply}
								/>
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
