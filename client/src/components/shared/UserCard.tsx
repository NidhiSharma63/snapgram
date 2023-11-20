import { Button } from "@/components/ui/button";
import { IUser } from "@/constant/interfaces";
import { Link } from "react-router-dom";

const UserCard = ({ user }: { user: IUser }) => {
  return (
    <Link to={`/profile/${user._id}`} className="user-card">
      <img
        src={user.avatar || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium dark:text-light-1 text-center line-clamp-1">@{user.username}</p>
        <p className="small-regular text-light-3 text-center line-clamp-1">@{user.email}</p>
      </div>

      <Button type="button" size="sm" className="shad-button_primary px-5">
        Follow
      </Button>
    </Link>
  );
};

export default UserCard;
