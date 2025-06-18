// import ImageComponent from "@/components/chat/Image";
// import { type IMessage, useSocket } from "@/context/socketProviders";
// import { useTheme } from "@/context/themeProviders";
// import { ColorRing } from "react-loader-spinner";

// const Loader = () => {
// 	const { theme } = useTheme();
// 	return (
// 		<ColorRing
// 			width={24}
// 			height={24}
// 			colors={
// 				theme === "dark"
// 					? ["#fff", "#fff", "#fff", "#fff", "#fff"]
// 					: ["#e3e2de", "#e3e2de", "#e3e2de", "#e3e2de", "#e3e2de"]
// 			}
// 		/>
// 	);
// };
// export default function UserMsg({
// 	isSender,
// 	isMsgDeleting,
// 	deleteMsgId,
// 	message,
// 	isImage,
// 	theme,
// 	handleDeleteMessage,
// 	handleClickOnReply,
// }: {
// 	isSender: boolean;
// 	isMsgDeleting: boolean;
// 	deleteMsgId: string;
// 	message: IMessage;
// 	isImage: boolean;
// 	theme: "light" | "dark";
// 	handleDeleteMessage: (
// 		e: React.MouseEvent<HTMLImageElement, MouseEvent>,
// 	) => void;
// 	handleClickOnReply: (
// 		e: React.MouseEvent<HTMLImageElement, MouseEvent>,
// 	) => void;
// }) {
// 	const { recipient } = useSocket();

// 	const showDeleteBtn =
// 		isSender &&
// 		deleteMsgId !== message._id &&
// 		!isMsgDeleting &&
// 		!message.isDummy;

// 	return (
// 		<>
// 			{message?.isDummy && <Loader />}
// 			{/* show loader only for that message which is being deleted by user */}
// 			{isSender && isMsgDeleting && deleteMsgId === message._id && <Loader />}
// 			{showDeleteBtn && (
// 				// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
// 				<img
// 					data-id={isImage ? message.message : message._id}
// 					onClick={handleDeleteMessage}
// 					src={"/assets/icons/delete.svg"}
// 					alt="delete"
// 					width={14}
// 					height={14}
// 					className="hidden group-hover:block cursor-pointer"
// 				/>
// 			)}
// 			{showDeleteBtn && (
// 				// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
// 				<img
// 					data-id={isImage ? message.message : message._id}
// 					onClick={handleClickOnReply}
// 					src={"/assets/icons/reply-arrow.svg"}
// 					alt="reply"
// 					width={14}
// 					height={14}
// 					className="hidden group-hover:block cursor-pointer"
// 				/>
// 			)}
// 			{isImage ? (
// 				<ImageComponent src={message.message} />
// 			) : (
// 				<div className="flex gap-2 items-center justify-end max-w-[80%]">
// 					{!isSender && (
// 						<img
// 							className="rounded-full w-8 h-8 object-cover shrink-0"
// 							alt="creator"
// 							src={recipient?.avatar || "/assets/icons/profile-placeholder.svg"}
// 						/>
// 					)}
// 					<div
// 						className={`flex flex-col gap-1 ${isSender ? "items-end" : "items-start"}`}
// 					>
// 						{message.replyText && (
// 							<>
// 								{message.replyText?.includes(
// 									"https://firebasestorage.googleapis.com",
// 								) ? (
// 									<ImageComponent src={message.replyText} />
// 								) : (
// 									<div
// 										className={`user-msg lg:text-lg text-xs px-6 py-3 bg-primary-500 w-fit rounded-xl ${isSender ? "rounded-br-none text-white" : theme === "dark" ? "!bg-[#1f1f1f]" : "!bg-[#f0f5f1]"} `}
// 									>
// 										{message.replyText}
// 									</div>
// 								)}
// 							</>
// 						)}
// 						<p
// 							className={`user-msg lg:text-lg text-xs px-6 py-3 bg-primary-500 w-fit rounded-xl ${isSender ? (theme === "dark" ? "!bg-[#1f1f1f]" : "!bg-[#f0f5f1]") : "rounded-br-none text-white"} `}
// 						>
// 							{message.message}
// 						</p>
// 					</div>
// 				</div>
// 			)}
// 			{!isSender && (
// 				// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
// 				<img
// 					data-id={isImage ? message.message : message._id}
// 					onClick={handleClickOnReply}
// 					src={"/assets/icons/reply-arrow.svg"}
// 					alt="reply"
// 					width={14}
// 					height={14}
// 					className="hidden group-hover:block cursor-pointer rotate-180"
// 				/>
// 			)}
// 			<br />
// 		</>
// 	);
// }
