import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useAuth from "@/hooks/query/useAuth";
import { useParams } from "react-router-dom";

export default function Chat() {
	const { useGetUserById } = useAuth();
	// get user id from params
	const userId = useParams<{ userId: string }>().userId;
	const { data: user, isPending } = useGetUserById(userId ?? "");
	console.log(user);
	if (!user && !isPending) {
		return (
			<div className="common-container !p-0 border-2 border-gray-300 border-black rounded-md">
				<h1>Something went wrong try again</h1>
			</div>
		);
	}
	return (
		<div className="common-container justify-between !p-0 border-2 border-gray-300 border-black rounded-md">
			<header className="flex items-center justify-start p-4 border-b-2 w-full border-gray-300 border-black gap-4">
				<img
					src={user?.avatar || "/assets/icons/profile-placeholder.svg"}
					alt={user?.username}
					className="rounded-full w-14 h-14 object-cover"
				/>
				<p className="base-medium h3-light dark:text-light text-center line-clamp-1">
					{user?.username}
				</p>
			</header>
			{"messages"}
			<div className="flex items-center justify-between p-4  w-full border-gray-300 border-black gap-4">
				<Textarea
					className="shad-textarea custom-scrollbar textarea-field-chat"
					placeholder="Type a message here..."
				/>
				<Button className="btn btn-primary">Send</Button>
			</div>
		</div>
	);
}