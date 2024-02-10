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
}: {
  likes: string[];
  postId: string;
  activeUser: User;
  savePosts: string[];
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
  // const [userLikedPost, setUserLikedPost] = useState(likes.includes(activeUser._id));

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
    setPostsWhichUserLiked([...postsWhichUserLiked, activeUser._id]);
    setIsPostLikeLoading(false);
    // setUserLikedPost(true);
  };

  const handleRemoveLikePost = async () => {
    setIsPostLikeLoading(true);
    await removeLike({ userId: activeUser?._id, postId });

    setPostsWhichUserLiked(postsWhichUserLiked.filter((item) => item !== activeUser._id));
    setIsPostLikeLoading(false);
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

  console.log({ savePosts });
  return (
    <div className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        {isPostLikeLoading ? (
          <Loader />
        ) : postsWhichUserLiked.includes(activeUser._id) ? (
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

        <p className="small-medium lg:base-medium text-[#877EFF]">
          {postsWhichUserLiked?.length > 0 ? postsWhichUserLiked?.length : ""}
        </p>
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
