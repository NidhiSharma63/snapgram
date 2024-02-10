function PostStats({ activeUser }) {
  const containerStyles = location.pathname.startsWith("/profile") ? "w-full" : "";
  return (
    <div className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        {userLikePostId === postId &&
        (fetchingLikeUpdatedData || isAddingItemsToLike || isRemovingPostFromLikeCollection) ? (
          <Loader />
        ) : likePostsData && likePostsData?.[0]?.postId.includes(postId) ? (
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
        <p className="small-medium lg:base-medium text-[#877EFF]">{likes?.length > 0 ? likes?.length : ""}</p>
      </div>

      <div className="flex gap-2">
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
