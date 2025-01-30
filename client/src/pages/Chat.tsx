import Message from "@/components/chat/Message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useSocket } from "@/context/socketProviders";
import { useTheme } from "@/context/themeProviders";
import { useUserDetail } from "@/context/userContext";
import { storage } from "@/firebase/config";
import useMessage from "@/hooks/query/useMessage";
import EmojiPicker from "emoji-picker-react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import type React from "react";
import { type SetStateAction, useCallback, useRef, useState } from "react";
import { ColorRing } from "react-loader-spinner";
import { v4 } from "uuid";

// Todo - fix authentication error issue
export default function Chat() {
	const {
		recipient,
		roomId,
		isPending,
		setIsMsgUploading,
		isMsgUploading,
		containerRef,
	} = useSocket();
	const { userDetails: currentUser } = useUserDetail();
	const [userMessage, setUserMessage] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const inputRef = useRef<null | HTMLInputElement>(null);
	const [usersMessageSentToBE, setUsersMessageSentToBE] = useState<
		{ [key: string]: string }[]
	>([]);
	const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
	const { theme } = useTheme();
	const { useSendMessage } = useMessage();

	const {
		mutateAsync: sendMessage,
		isError: isMessageSendingError,
		isPending: isMessageSendingPending,
	} = useSendMessage();

	// handle message change
	const handleMessageChange = useCallback(
		(e: { target: { value: SetStateAction<string> } }) => {
			setUserMessage(e.target.value);
		},
		[],
	);

	// handle send message
	const handleSendMessage = useCallback(async () => {
		if (!currentUser || !recipient || !roomId) {
			return toast({
				title: "Something went wrong",
			});
		}
		setIsMsgUploading(true);
		let message = {};
		if (file) {
			// if user has selected the file then send the file to firebase storage on frontend only
			const imageRef = ref(storage, `/images/${file}-${v4()}`);
			const snapshot = await uploadBytes(imageRef, file);
			const url = await getDownloadURL(snapshot.ref);
			message = {
				roomId,
				senderId: currentUser?._id,
				receiverId: recipient?._id,
				message: url,
				createdAt: new Date(),
			};
			setUsersMessageSentToBE([message]);
			sendMessage(message).then(() => {
				setUsersMessageSentToBE([]);
			});
			setFile(null);
			if (inputRef.current) {
				inputRef.current.value = "";
			}
		}
		if (userMessage?.trim()) {
			message = {
				roomId,
				senderId: currentUser?._id,
				receiverId: recipient?._id,
				message: userMessage,
				createdAt: new Date(),
			};
			setUsersMessageSentToBE((prev) => [...prev, message]);
			sendMessage(message).then(() => {
				setUsersMessageSentToBE([]);
			});
		}
		setUserMessage("");
		setIsMsgUploading(false);
		if (containerRef?.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
		}
	}, [
		recipient,
		currentUser,
		userMessage,
		sendMessage,
		roomId,
		file,
		setIsMsgUploading,
		containerRef,
	]);

	// handle file change
	const handleFileChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const selectedFile = event.target.files?.[0];
			// setFile(event.current.files[0]);
			if (selectedFile) {
				setFile(selectedFile);
			}
		},
		[],
	);

	// handle file delete
	const handleFileDelete = useCallback(() => {
		setFile(null); // Clear the file state
		if (inputRef.current) {
			inputRef.current.value = ""; // Reset the input value
		}
	}, []);
	// handle click on gallery
	const handleClickOnGallery = useCallback(() => {
		inputRef?.current?.click();
	}, []);

	// handle click on emoji button
	const handleClickOnEmojiButton = useCallback(
		(event: React.MouseEvent) => {
			event.stopPropagation();
			setOpenEmojiPicker(!openEmojiPicker);
		},
		[openEmojiPicker],
	);

	// handle click on emoji
	const handleClickOnEmoji = useCallback((event: { emoji: string }) => {
		setUserMessage((prev) => prev + event.emoji);
	}, []);

	if (!recipient && !isPending) {
		return (
			<div className="common-container !p-0 border-2 border-gray-300 border-black rounded-md">
				<h1>Something went wrong try again</h1>
			</div>
		);
	}

	return (
		<>
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div
				className="common-container !gap-0 !p-0 !z-[1]  rounded-md !overflow-hidden border-2 border-gray-300 border-black bg-red-50"
				onClick={() => setOpenEmojiPicker(false)}
			>
				<header className="flex items-center justify-start p-4  border-b-2 w-full border-gray-300 border-black gap-4 md:h-[80px] h-[60px]">
					<img
						src={recipient?.avatar || "/assets/icons/profile-placeholder.svg"}
						alt={recipient?.username}
						className="rounded-full lg:w-12 w-8 lg:h-12 h-8 object-cover"
					/>
					<p className="base-medium lg:h3-light dark:text-light text-center line-clamp-1">
						{recipient?.username}
					</p>
				</header>
				<Message
					isMessageSendingPending={isMessageSendingPending}
					usersMessageSentToBE={usersMessageSentToBE}
					isMessageSendingError={isMessageSendingError}
				/>
				<div className="flex items-center  justify-between lg:p-4 p-2 w-full gap-4">
					<div className="flex flex-col w-full border-2 border-gray-300 border-black rounded-md">
						{file && (
							<div className="mt-2 flex items-start gap-2">
								<img
									src={URL.createObjectURL(file)}
									alt="Selected file preview"
									className="w-20 h-20 object-cover rounded-md"
								/>
								{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
								<img
									onClick={handleFileDelete}
									src={"/assets/icons/delete.svg"}
									alt="delete"
									width={24}
									height={24}
									style={{
										cursor: "pointer",
									}}
									className="cursor-pointer lg:w-8 w-4 lg:h-8 h-4"
								/>
							</div>
						)}
						<Textarea
							className="shad-textarea custom-scrollbar textarea-field-chat !border-0 lg:text-base text-xs"
							placeholder="Type a message here..."
							value={userMessage}
							onChange={handleMessageChange}
						/>
						<Button onClick={handleClickOnEmojiButton}>Add Emoji</Button>
					</div>

					<input
						type="file"
						hidden
						ref={inputRef}
						onChange={handleFileChange}
					/>
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
					<img
						src="/assets/icons/gallery-add.svg"
						className="btn-primary cursor-pointer lg:w-8 w-4 lg:h-8 h-4"
						alt="photos"
						onClick={handleClickOnGallery}
					/>
					{isMsgUploading ? (
						<Button className="btn btn-primary">
							<ColorRing
								width={24}
								height={24}
								colors={
									theme === "dark"
										? ["#fff", "#fff", "#fff", "#fff", "#fff"]
										: ["#e3e2de", "#e3e2de", "#e3e2de", "#e3e2de", "#e3e2de"]
								}
							/>
						</Button>
					) : (
						// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
						<div onClick={handleSendMessage}>
							<Button className="btn hidden lg:block bg-[#877EFF]">Send</Button>
							<img
								src="/assets/icons/send.svg"
								width={24}
								className="lg:hidden block cursor-pointer"
								alt="send"
							/>
						</div>
					)}
				</div>
			</div>
			{openEmojiPicker && (
				<div className="absolute bottom-[10%] right-[10%] z-50">
					<EmojiPicker onEmojiClick={handleClickOnEmoji} />
				</div>
			)}
		</>
	);
}
