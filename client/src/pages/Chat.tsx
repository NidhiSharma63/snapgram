// import Message from "@/components/chat/Message";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { toast } from "@/components/ui/use-toast";
// import { type IMessage, useSocket } from "@/context/socketProviders";
// import { useTheme } from "@/context/themeProviders";
// import { useUserDetail } from "@/context/userContext";
// import { storage } from "@/firebase/config";
// import useMessage from "@/hooks/query/useMessage";
// import EmojiPicker from "emoji-picker-react";
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// import type React from "react";
// import {
// 	type SetStateAction,
// 	useCallback,
// 	useEffect,
// 	useRef,
// 	useState,
// } from "react";
// import { ColorRing, ThreeDots } from "react-loader-spinner";
// import { useNavigate } from "react-router-dom";
// import { v4 } from "uuid";

// const TypingIndicator = () => {
// 	return (
// 		<div className="w-full px-5 md:px-8  flex align-center justify-start">
// 			<div className="bg-[#f0f5f1] w-[80px] h-[30px] rounded-xl flex align-center justify-center">
// 				<ThreeDots
// 					visible={true}
// 					height="30"
// 					width="40"
// 					// color="#fff"
// 					color="#877EFF"
// 					radius="9"
// 					ariaLabel="three-dots-loading"
// 					wrapperStyle={{}}
// 					wrapperClass=""
// 				/>
// 			</div>
// 		</div>
// 	);
// };

// // Todo - fix authentication error issue
// export default function Chat() {
// 	const {
// 		recipient,
// 		roomId,
// 		isPending,
// 		setIsMsgUploading,
// 		isMsgUploading,
// 		containerRef,
// 		replyText,
// 		setReplyText,
// 		setMessages,
// 		pusherInstance,
// 		isTyping,
// 		setIsTyping,
// 		setUserWhoIsNotTyping,
// 		userWhoIsNotTyping,
// 	} = useSocket();
// 	const { userDetails: currentUser } = useUserDetail();
// 	// const [isTyping, setIsTyping] = useState(false);
// 	const [userMessage, setUserMessage] = useState("");
// 	const [file, setFile] = useState<File | null>(null);
// 	const inputRef = useRef<null | HTMLInputElement>(null);
// 	const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
// 	const { theme } = useTheme();
// 	const { useSendMessage, useAddTypingIndicator, useRemoveTypingIndicator } =
// 		useMessage();
// 	const { mutate: addTypingIndicator } = useAddTypingIndicator();
// 	const { mutate: removeTypingIndicator } = useRemoveTypingIndicator();
// 	const navigate = useNavigate();
// 	// const [userWhoIsNotTyping, setUserWhoIsNotTyping] = useState<string | null>("");

// 	const { mutateAsync: sendMessage, isPending: isMessageSendingPending } =
// 		useSendMessage();

// 	// listen to typing indicator
// 	useEffect(() => {
// 		pusherInstance
// 			?.channel(`public-${roomId}`)
// 			?.bind(
// 				"typing-indicator",
// 				(data: { roomId: string; isTyping: boolean; receiverId: string }) => {
// 					setIsTyping(data.isTyping);
// 					setUserWhoIsNotTyping(data?.receiverId);
// 				},
// 			);
// 	}, [pusherInstance, roomId, setIsTyping, setUserWhoIsNotTyping]);

// 	// handle input change
// 	const handleAddTypingIndicator = useCallback(async () => {
// 		if (isTyping && userMessage?.trim()) return;
// 		addTypingIndicator({
// 			roomId,
// 			receiverId: recipient?._id ?? "",
// 		});
// 	}, [roomId, addTypingIndicator, isTyping, userMessage, recipient]);

// 	// handle remove typing indicator
// 	const handleRemoveTypingIndicator = useCallback(() => {
// 		removeTypingIndicator({
// 			roomId,
// 		});
// 	}, [removeTypingIndicator, roomId]);

// 	// handle message change
// 	const handleMessageChange = useCallback(
// 		(e: { target: { value: SetStateAction<string> } }) => {
// 			setUserMessage(e.target.value);
// 		},
// 		[],
// 	);

// 	// handle send message
// 	const handleSendMessage = useCallback(async () => {
// 		if (!currentUser || !recipient || !roomId) {
// 			return toast({
// 				title: "Something went wrong",
// 			});
// 		}
// 		let message = {};
// 		if (file) {
// 			setIsMsgUploading(true);
// 			// if user has selected the file then send the file to firebase storage on frontend only
// 			const imageRef = ref(storage, `/images/${file}-${v4()}`);
// 			const snapshot = await uploadBytes(imageRef, file);
// 			const url = await getDownloadURL(snapshot.ref);

// 			message = {
// 				roomId,
// 				senderId: currentUser?._id,
// 				receiverId: recipient?._id,
// 				message: url,
// 				createdAt: new Date(),
// 				replyText,
// 			};
// 			const exrtaPropsForTsWarning: IMessage = {
// 				_id: v4(),
// 				seenAt: "",
// 				isSeen: false,
// 				__v: 0,
// 				isDummy: true,
// 				...message,
// 			} as IMessage;
// 			// @ts-ignore
// 			setMessages((prevMessages) => {
// 				if (!prevMessages) return [exrtaPropsForTsWarning];
// 				return [...prevMessages, exrtaPropsForTsWarning];
// 			});

// 			await sendMessage(message).then(() => {
// 				setReplyText("");
// 			});
// 			setIsMsgUploading(false);
// 			setFile(null);
// 			if (inputRef.current) {
// 				inputRef.current.value = "";
// 			}
// 		}
// 		if (userMessage?.trim()) {
// 			message = {
// 				roomId,
// 				senderId: currentUser?._id,
// 				receiverId: recipient?._id,
// 				message: userMessage,
// 				createdAt: new Date(),
// 				replyText,
// 			};
// 			const exrtaPropsForTsWarning: IMessage = {
// 				_id: v4(),
// 				seenAt: "",
// 				isSeen: false,
// 				__v: 0,
// 				isDummy: true,
// 				...message,
// 			} as IMessage;
// 			// @ts-ignore
// 			setMessages((prevMessages) => {
// 				if (!prevMessages) return [exrtaPropsForTsWarning];
// 				return [...prevMessages, exrtaPropsForTsWarning];
// 			});
// 			setReplyText("");
// 			setUserMessage("");
// 			sendMessage(message);
// 		}

// 		if (containerRef?.current) {
// 			containerRef.current.scrollTop = containerRef.current.scrollHeight;
// 		}
// 	}, [
// 		setMessages,
// 		recipient,
// 		currentUser,
// 		userMessage,
// 		sendMessage,
// 		roomId,
// 		file,
// 		setIsMsgUploading,
// 		containerRef,
// 		replyText,
// 		setReplyText,
// 	]);

// 	// handle file change
// 	const handleFileChange = useCallback(
// 		(event: React.ChangeEvent<HTMLInputElement>) => {
// 			const selectedFile = event.target.files?.[0];
// 			// setFile(event.current.files[0]);
// 			if (selectedFile) {
// 				setFile(selectedFile);
// 			}
// 		},
// 		[],
// 	);

// 	// handle file delete
// 	const handleFileDelete = useCallback(() => {
// 		setFile(null); // Clear the file state
// 		if (inputRef.current) {
// 			inputRef.current.value = ""; // Reset the input value
// 		}
// 	}, []);

// 	// handle click on gallery
// 	const handleClickOnGallery = useCallback(() => {
// 		inputRef?.current?.click();
// 	}, []);

// 	// handle click on emoji button
// 	const handleClickOnEmojiButton = useCallback(
// 		(event: React.MouseEvent) => {
// 			event.stopPropagation();
// 			setOpenEmojiPicker(!openEmojiPicker);
// 		},
// 		[openEmojiPicker],
// 	);

// 	// handle click on emoji
// 	const handleClickOnEmoji = useCallback((event: { emoji: string }) => {
// 		setUserMessage((prev) => prev + event.emoji);
// 	}, []);

// 	// reset reply text
// 	const resetReplyText = useCallback(() => {
// 		setReplyText("");
// 	}, [setReplyText]);

// 	// go back
// 	const goBack = useCallback(() => {
// 		navigate(-1);
// 	}, [navigate]);

// 	if (!recipient && !isPending) {
// 		return (
// 			<div className="common-container !p-0 border-2 border-gray-300 border-black rounded-md">
// 				<h1>Something went wrong try again</h1>
// 			</div>
// 		);
// 	}

// 	return (
// 		<>
// 			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
// 			<div
// 				className="common-container !gap-0 !p-0 !z-[1]  rounded-md !overflow-hidden border-2 border-gray-300 border-black bg-red-50"
// 				onClick={() => setOpenEmojiPicker(false)}
// 			>
// 				<header className="flex items-center justify-start p-4  border-b-2 w-full border-gray-300 border-black gap-4 md:h-[80px] h-[60px]">
// 					{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
// 					<img
// 						src={"/assets/icons/back.svg"}
// 						alt={"back"}
// 						className="rounded-full lg:w-8 w-4 lg:h-8 h-4 object-cover cursor-pointer"
// 						onClick={goBack}
// 					/>
// 					<img
// 						src={recipient?.avatar || "/assets/icons/profile-placeholder.svg"}
// 						alt={recipient?.username}
// 						className="rounded-full lg:w-12 w-8 lg:h-12 h-8 object-cover"
// 					/>
// 					<p className="base-medium lg:h3-light dark:text-light text-center line-clamp-1">
// 						{recipient?.username}
// 					</p>
// 				</header>
// 				<Message />
// 				{isTyping && currentUser?._id === userWhoIsNotTyping && (
// 					<TypingIndicator />
// 				)}
// 				<div className="flex items-center  justify-between lg:p-4 p-2 w-full gap-4">
// 					<div className="flex flex-col w-full border-2 border-gray-300 border-black rounded-md">
// 						{replyText && !isMessageSendingPending && (
// 							<div className="flex items-center justify-between gap-2 p-2 border-b-2 border-gray-300 border-black">
// 								{replyText?.includes(
// 									"https://firebasestorage.googleapis.com",
// 								) ? (
// 									<img
// 										src={replyText}
// 										alt="Selected file preview"
// 										className="w-20 h-20 object-cover rounded-md"
// 									/>
// 								) : (
// 									replyText
// 								)}
// 								{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
// 								<img
// 									onClick={resetReplyText}
// 									src={"/assets/icons/delete.svg"}
// 									alt="delete"
// 									className="cursor-pointer lg:w-4 w-3 lg:h-4 h-3"
// 								/>
// 							</div>
// 						)}
// 						{file && (
// 							<div className="mt-2 flex items-start gap-2">
// 								<img
// 									src={URL.createObjectURL(file)}
// 									alt="Selected file preview"
// 									className="w-20 h-20 object-cover rounded-md"
// 								/>
// 								{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
// 								<img
// 									onClick={handleFileDelete}
// 									src={"/assets/icons/delete.svg"}
// 									alt="delete"
// 									className="cursor-pointer lg:w-8 w-4 lg:h-8 h-4"
// 								/>
// 							</div>
// 						)}
// 						<Textarea
// 							className="shad-textarea custom-scrollbar textarea-field-chat !border-0 lg:text-base text-xs"
// 							placeholder="Type a message here..."
// 							value={userMessage}
// 							onChange={handleMessageChange}
// 							onBlur={handleRemoveTypingIndicator}
// 							onInput={handleAddTypingIndicator}
// 						/>
// 					</div>

// 					<input
// 						type="file"
// 						hidden
// 						ref={inputRef}
// 						onChange={handleFileChange}
// 					/>
// 					{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
// 					<img
// 						src="/assets/icons/emoji.svg"
// 						alt="emoji"
// 						className="lg:w-8 w-4 lg:h-8 h-4 cursor-pointer"
// 						onClick={handleClickOnEmojiButton}
// 					/>
// 					{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
// 					<img
// 						src="/assets/icons/gallery-add.svg"
// 						className="btn-primary cursor-pointer lg:w-8 w-4 lg:h-8 h-4"
// 						alt="photos"
// 						onClick={handleClickOnGallery}
// 					/>
// 					{isMsgUploading ? (
// 						<Button className="btn btn-primary">
// 							<ColorRing
// 								width={24}
// 								height={24}
// 								colors={
// 									theme === "dark"
// 										? ["#fff", "#fff", "#fff", "#fff", "#fff"]
// 										: ["#e3e2de", "#e3e2de", "#e3e2de", "#e3e2de", "#e3e2de"]
// 								}
// 							/>
// 						</Button>
// 					) : (
// 						// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
// 						<div onClick={handleSendMessage}>
// 							<Button className="btn hidden lg:block bg-[#877EFF]">Send</Button>
// 							<img
// 								src="/assets/icons/send.svg"
// 								width={24}
// 								className="lg:hidden block cursor-pointer"
// 								alt="send"
// 							/>
// 						</div>
// 					)}
// 				</div>
// 			</div>
// 			{openEmojiPicker && (
// 				<div className="absolute bottom-[10%] right-[10%] z-50">
// 					<EmojiPicker onEmojiClick={handleClickOnEmoji} />
// 				</div>
// 			)}
// 		</>
// 	);
// }
