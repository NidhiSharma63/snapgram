"use client";

import Loader from "@/src/components/shared/Loader";
import { useUserPostIdForSaveAndLike } from "@/src/context/userSaveAndLikeContext";
import { addLike, removeLike } from "@/src/server/like";
import { addSaves, removeSaves } from "@/src/server/save";
import { User } from "@/src/types/user";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function PostStats({
  likes,
  postId,
  activeUser,
  savePosts,
  totalLike,
}: {
  likes: string[];
  postId: string;
  activeUser: User;
  savePosts: string[];
  totalLike: number;
}) {
  const pathname = usePathname();
  const containerStyles = pathname.startsWith("/profile") ? "w-full" : "";
  const {
    setPostsWhichUserLiked,
    postsWhichUserLiked,
    initialRender,
    setInitialRender,
    setUserSavePostId,
    userSavePostId,
  } = useUserPostIdForSaveAndLike();
  const [isPostLikeLoading, setIsPostLikeLoading] = useState(false);
  const [isPostSaveLoading, setIsPostSaveLoading] = useState(false);
  const [totalLikes,setTotalLikes] = useState(totalLike)
  // const [userLikedPost, setUserLikedPost] = useState(likes.includes(activeUser._id));

  // console.log({ postsWhichUserLiked,likes });
  useEffect(() => {
    if (!initialRender) {
      setPostsWhichUserLiked(likes);
      setUserSavePostId(savePosts);
      setInitialRender(true);
    }
  }, [likes, savePosts]);

  const handleAddLikePost = async () => {
    setIsPostLikeLoading(true);
    await addLike({ userId: activeUser?._id, postId });
    setPostsWhichUserLiked([...postsWhichUserLiked, postId]);
    setIsPostLikeLoading(false);
    setTotalLikes((prev)=>prev+1)
    // setUserLikedPost(true);
  };

  const handleRemoveLikePost = async () => {
    setIsPostLikeLoading(true);
    await removeLike({ userId: activeUser?._id, postId });

    setPostsWhichUserLiked(postsWhichUserLiked.filter((item) => item !== postId));
    setIsPostLikeLoading(false);
    setTotalLikes((prev)=>prev-1)
  };

  const handleAddSavePost = async () => {
    setIsPostSaveLoading(true);
    await addSaves({ userId: activeUser?._id, postId });
    setUserSavePostId([...savePosts, postId]);
    setIsPostSaveLoading(false);
  };

  const handleRemoveSavePost = async () => {
    setIsPostSaveLoading(true);
    await removeSaves({ userId: activeUser?._id, postId });
    setUserSavePostId(savePosts.filter((item: string) => item !== postId));
    setIsPostSaveLoading(false);
  };
  // console.log({ postsWhichUserLiked });

  // console.log({ savePosts });
  return (
    <div className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        {isPostLikeLoading ? (
          <Loader />
        ) : postsWhichUserLiked.includes(postId) ? (
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
        )}

        <p className="small-medium lg:base-medium text-[#877EFF]">{totalLikes > 0 ? totalLikes : ""}</p>
      </div>

      <div className="flex gap-2">
        {isPostSaveLoading ? (
          <Loader />
        ) : userSavePostId.includes(postId) ? (
          <img
            // src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            src={"/assets/icons/saved.svg"}
            alt="share"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={handleRemoveSavePost}
          />
        ) : (
          <img
            src={"/assets/icons/save.svg"}
            alt="share"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={handleAddSavePost}
          />
        )}
      </div>
    </div>
  );
}

export default PostStats;
