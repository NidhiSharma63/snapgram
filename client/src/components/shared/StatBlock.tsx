import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { IUser } from "@/constant/interfaces";
import useAuth from "@/hooks/query/useAuth";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

export default function StatBlock({ data: currentUser }: { data: IUser }) {
	const [statsData, setStatsData] = useState<{ value: string; data: IUser[] }>({
		value: "",
		data: [],
	});

	/**
	 * As for now my app is on small and have very few user so for getting follower/followings data we can
	 * use the allUser data and filterOut the follower/following. it is better option for now cause we dont have to make another call
	 */
	const { useGetAllUser } = useAuth();
	const { data } = useGetAllUser();

	const handleClickOnStat = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			const value = e.currentTarget.getAttribute("data-value");
			if (value === "followers") {
				const followersData = data?.filter(
					(user: IUser) =>
						currentUser?.followers?.includes(user._id) &&
						user._id !== currentUser._id,
				);
				setStatsData({ data: followersData, value: "Followers" });
			} else {
				const followersData = data?.filter(
					(user: IUser) =>
						currentUser?.followings?.includes(user._id) &&
						user._id !== currentUser._id,
				);
				setStatsData({ value: "Followings", data: followersData });
			}
		},
		[currentUser, data],
	);
	return (
		<div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20 ">
			<Popover>
				<PopoverContent>
					<div className="flex flex-col gap-3">
						<p className="base-medium align-center w-full text-center justify-center">
							{statsData?.value}
						</p>
						<hr />
						{statsData?.data?.map((item: IUser) => {
							return (
								<Link
									to={`/profile/${item?._id}`}
									key={item?._id}
									className="flex items-center gap-4 w-full"
								>
									<img
										className="w-10 h-10 rounded-full object-cover"
										src={
											item?.avatar || "/assets/icons/profile-placeholder.svg"
										}
										alt="profile"
									/>
									<p className="small-semibold lg:base-medium dark:text-light-2">
										{item?.username}
									</p>
								</Link>
							);
						})}
					</div>
				</PopoverContent>

				{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
				<div
					className="flex-center gap-2 cursor-pointer"
					onClick={handleClickOnStat}
					data-value="followers"
				>
					<PopoverTrigger>
						<p className="small-semibold lg:body-bold text-primary-500">
							{currentUser?.followers?.length || 0}
						</p>
						<p className="small-medium lg:base-medium dark:text-light-2">
							Followers
						</p>
					</PopoverTrigger>
				</div>
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
				<div
					className="flex-center gap-2 cursor-pointer"
					onClick={handleClickOnStat}
					data-value="followings"
				>
					<PopoverTrigger>
						<p className="small-semibold lg:body-bold text-primary-500">
							{currentUser?.followings?.length || 0}
						</p>
						<p className="small-medium lg:base-medium dark:text-light-2">
							Following
						</p>
					</PopoverTrigger>
				</div>
			</Popover>
		</div>
	);
}
