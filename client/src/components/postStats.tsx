"use client";

import { addLike, removeLike } from "@/src/server/like";
import { User } from "@/src/types/user";
import { usePathname } from "next/navigation";

function PostStats({ likes, postId, activeUser }: { likes: string[]; postId: string; activeUser: User }) {
  const pathname = usePathname();
  const containerStyles = pathname.startsWith("/profile") ? "w-full" : "";
  // const [userLikedPost, setUserLikedPost] = useState(likes.includes(activeUser._id));

  const handleAddLikePost = async () => {
    await addLike({ userId: activeUser?._id, postId });
    // setUserLikedPost(true);
  };

  const handleRemoveLikePost = async () => {
    await removeLike({ userId: activeUser?._id, postId });
    // setUserLikedPost(false);
  };
  return (
    <div className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        {/* {userLikedPost ? (
          <img
            alt="like"
            src="/assets/icons/liked.svg"
            width={20}
            height={20}
            onClick={handleRemoveLikePost}
            className="cursor-pointer"
          />
        ) : (
          <img
            alt="like"
            src="/assets/icons/like.svg"
            width={20}
            height={20}
            onClick={handleAddLikePost}
            className="cursor-pointer"
          />
        )} */}
        {/* {userLikePostId === postId &&
        (fetchingLikeUpdatedData || isAddingItemsToLike || isRemovingPostFromLikeCollection) ? (
          <Loader />
        ) : likePostsData && likePostsData?.[0]?.postId.includes(postId) ? (
          <img
            alt="like"
            src="/assets/icons/liked.svg"
            width={20}
            height={20}
            // onClick={handleRemoveLikePost}
            className="cursor-pointer"
          />
        ) : (
          <img
            alt="like"
            src="/assets/icons/like.svg"
            width={20}
            height={20}
            // onClick={handleAddLikePost}
            className="cursor-pointer"
          />
        )} */}
        <p className="small-medium lg:base-medium text-[#877EFF]">{likes?.length > 0 ? likes?.length : ""}</p>
      </div>

      {/* <div className="flex gap-2">
        {(fetchingSaveItems || isSavingInSaveCollection || isRemovingItemsFromSaveCollection) &&
        postId === userSavePostId ? (
          <Loader />
        ) : SavePostData && SavePostData?.[0]?.postId.includes(postId) ? (
          <img
            //   src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            src={"/assets/icons/saved.svg"}
            alt="share"
            width={20}
            height={20}
            className="cursor-pointer"
            // onClick={handleRemoveSavePost}
          />
        ) : (
          <img
            src={"/assets/icons/save.svg"}
            alt="share"
            width={20}
            height={20}
            className="cursor-pointer"
            // onClick={handleAddSavePost}
          />
        )}
      </div> */}
    </div>
  );
}

export default PostStats;
