import { useSocket } from "@/context/socketProviders";

export default function Message() {
	const { messages } = useSocket();
	return (
		<div className="common-container w-full border-2 border-gray-300 border-black h-full">
			{messages.length === 0 ? (
				<p className="base-light dark:text-light text-center line-clamp-1">
					No messages
				</p>
			) : (
				<h1>You have something to see</h1>
			)}
		</div>
	);
}