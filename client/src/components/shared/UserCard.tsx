import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import type { IUser } from "@/constant/interfaces";
import { useUserDetail } from "@/context/userContext";
import useFollowerFollowing from "@/hooks/query/useFollower_following";
import { useCallback } from "react";
import { Link } from "react-router-dom";

const UserCard = ({
  user,
  showingOnInbox,
}: {
  user: IUser;
  showingOnInbox: boolean;
}) => {
  const { addFollower, removeFollower } = useFollowerFollowing();
  const { mutateAsync: followToUser, isPending: isFollowingUserPending } =
    addFollower();
  const { mutateAsync: unfollowToUser, isPending: isUnFollowingUserPending } =
    removeFollower();
  const { userDetails } = useUserDetail();

  /**
   * Handle click on follow
   */
  const handleClickOnFollow = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      await followToUser({
        followerId: user._id,
      });
    },
    [followToUser, user]
  );

  /**
   * Handle click on unfollow
   */
  const handleClickOnUnFollow = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      await unfollowToUser({
        followerId: user._id,
      });
    },
    [unfollowToUser, user]
  );

  return (
    <Link to={`/profile/${user._id}`} className="user-card">
      <img
        src={user.avatar || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14 object-cover"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium dark:text-light-1 text-center line-clamp-1">
          @{user.username}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1 flex-wrap">
          @{user.email}
        </p>
      </div>

      {!showingOnInbox &&
        (userDetails?.followers?.includes(user._id) ? (
          isUnFollowingUserPending ? (
            <Button className="shad-button_primary whitespace-nowrap">
              <Loader />
            </Button>
          ) : (
            <Button
              size="sm"
              className="shad-button_primary px-5 whitespace-nowrap"
              disabled={isUnFollowingUserPending}
              onClick={handleClickOnUnFollow}
            >
              Unfollow
            </Button>
          )
        ) : isFollowingUserPending ? (
          <Button className="shad-button_primary whitespace-nowrap">
            <Loader />
          </Button>
        ) : (
          <Button
            size="sm"
            className="shad-button_primary px-5 whitespace-nowrap"
            disabled={isFollowingUserPending}
            onClick={handleClickOnFollow}
          >
            Follow
          </Button>
        ))}

      {/* {showingOnInbox ? (
				<Button
					type="button"
					size="sm"
					className="shad-button_primary px-5"
					onClick={handleClickOnMSG}
				>
					Message {allUnSeenMsgs?.length > 0 && `(${allUnSeenMsgs?.length})`}
				</Button>
			) : (
				<Button
					type="button"
					size="sm"
					className="shad-button_primary px-5"
					onClick={handleClickOnFollow}
				>
					Follow
				</Button>
			)} */}
    </Link>
  );
};

export default UserCard;
