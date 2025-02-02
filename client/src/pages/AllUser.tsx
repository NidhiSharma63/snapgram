import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { useToast } from "@/components/ui/use-toast";
import type { IUser } from "@/constant/interfaces";
import { useUserDetail } from "@/context/userContext";
import useAuth from "@/hooks/query/useAuth";

const AllUsers = ({ showingOnInbox = false }: { showingOnInbox?: boolean }) => {
	const { toast } = useToast();
	const { useGetAllUser } = useAuth();
	const { userDetails } = useUserDetail();
	const {
		data: creators,
		isError: isErrorCreators,
		isPending: isLoading,
	} = useGetAllUser();

	if (isErrorCreators) {
		toast({ title: "Something went wrong." });

		return;
	}

	return (
		<div className="common-container">
			<div className="user-container">
				<h2 className="h3-bold md:h2-bold text-left w-full">
					{showingOnInbox ? "People" : "All Users"}
				</h2>
				{showingOnInbox &&
					(userDetails?.followers?.length === 0 ||
						userDetails?.followings?.length === 0) && (
						<p className="subtle-semibold text-center w-full">
							Follow people to start messaging
						</p>
					)}
				{isLoading && !creators ? (
					<Loader />
				) : (
					<ul className="user-grid">
						{creators?.map((creator: IUser) => {
							if (
								creator._id === userDetails?._id ||
								(!userDetails?.followers?.includes(creator._id) &&
									showingOnInbox)
							)
								return;
							return (
								<li key={creator?._id} className="flex-1 w-[300px]  ">
									<UserCard showingOnInbox={showingOnInbox} user={creator} />
								</li>
							);
						})}
					</ul>
				)}
			</div>
		</div>
	);
};

export default AllUsers;
