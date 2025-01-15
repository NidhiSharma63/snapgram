import { useUserDetail } from "@/context/userContext";
import { useUserPostIdForSaveAndLike } from "@/context/userPostIdForSaveAndLike";
import useLikePost from "@/hooks/query/useLikePost";
import useSavePost from "@/hooks/query/useSavePost";
import Loader from "./Loader";

function PostStats({ postId, likes }: { postId: string; likes: string[] }) {
  const containerStyles = location.pathname.startsWith("/profile") ? "w-full" : "";
  const { userDetails } = useUserDetail();
  const { setLikePostId, setSavePostId, userLikePostId, userSavePostId } = useUserPostIdForSaveAndLike();
  // save post
  const { useAddSave, useRemoveSave, useGetAllSavePost } = useSavePost();
  const { mutateAsync: addSave, isPending: isSavingInSaveCollection } = useAddSave();
  const { mutateAsync: removeSave, isPending: isRemovingItemsFromSaveCollection } = useRemoveSave();

  // like post
  const { useRemoveLike, useGetAllLike, useAddLike } = useLikePost();
  const { mutateAsync: removePostFromLike, isPending: isRemovingPostFromLikeCollection } = useRemoveLike();
  const { mutateAsync: addLike, isPending: isAddingItemsToLike } = useAddLike();
  const {
    data: likePostsData,
    isFetching: fetchingLikeUpdatedData,
    isPending: isStillLoadingLikePostData,
  } = useGetAllLike();

  const {
    data: SavePostData,
    isPending: isStillLoadingSavedPostData,
    isFetching: fetchingSaveItems,
  } = useGetAllSavePost();

  const handleAddSavePost = async () => {
    if (userDetails) {
      setSavePostId(postId);
      await addSave({ postId, userId: userDetails?._id });
    }
  };

  const handleRemoveSavePost = async () => {
    if (userDetails) {
      setSavePostId(postId);
      await removeSave({ postId, userId: userDetails?._id });
    }
  };

  const handleAddLikePost = async () => {
    if (userDetails) {
      setLikePostId(postId);
      await addLike({ postId, userId: userDetails?._id });
    }
  };

  const handleRemoveLikePost = async () => {
    if (userDetails) {
      setLikePostId(postId);
      // console.log("post rmoved");
						await removePostFromLike({ postId, userId: userDetails?._id });
    }
  };

  if (isStillLoadingSavedPostData || isStillLoadingLikePostData) return <Loader />;

  return (
			<div
				className={`flex justify-between items-center z-20 ${containerStyles}`}
			>
				<div className="flex gap-2 mr-5">
					{userLikePostId === postId &&
					(fetchingLikeUpdatedData ||
						isAddingItemsToLike ||
						isRemovingPostFromLikeCollection) ? (
						<Loader />
					) : likePostsData?.[0]?.postId.includes(postId) ? (
						// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
						<img
							alt="like"
							src="/assets/icons/liked.svg"
							width={20}
							height={20}
							onClick={handleRemoveLikePost}
							className="cursor-pointer"
						/>
					) : (
						// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
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
						{likes?.length > 0 ? likes?.length : ""}
					</p>
				</div>

				<div className="flex gap-2">
					{(fetchingSaveItems ||
						isSavingInSaveCollection ||
						isRemovingItemsFromSaveCollection) &&
					postId === userSavePostId ? (
						<Loader />
					) : SavePostData?.[0]?.postId.includes(postId) ? (
						<img
							// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
							src={"/assets/icons/saved.svg"}
							alt="share"
							width={20}
							height={20}
							className="cursor-pointer"
							onClick={handleRemoveSavePost}
						/>
					) : (
						<img
							// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
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
