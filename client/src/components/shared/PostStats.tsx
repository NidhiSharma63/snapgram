import { useUserDetail } from "@/context/userContext";
import useSavePost from "@/hooks/query/useSavePost";
import Loader from "./Loader";

function PostStats({ postId }: { postId: string }) {
  const containerStyles = location.pathname.startsWith("/profile") ? "w-full" : "";
  const { useAddSave, useRemoveSave } = useSavePost();
  const { userDetails } = useUserDetail();
  const { mutateAsync: addSave } = useAddSave();
  const { mutateAsync: removeSave } = useRemoveSave();
  const { useGetAllSavePost } = useSavePost();
  const { data: SavePostData, isPending: isStillLoadingSavedPostData, isFetching } = useGetAllSavePost();

  const handleAddSavePost = () => {
    if (userDetails) {
      addSave({ postId, userId: userDetails?._id });
    }
  };

  const handleRemoveSavePost = () => {
    if (userDetails) {
      removeSave({ postId, userId: userDetails?._id });
    }
  };

  if (isStillLoadingSavedPostData) return <Loader />;
  return (
    <div className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        <img
          //   src={`${checkIsLiked(likes, userId) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}`}
          alt="like"
          src="/assets/icons/like.svg"
          width={20}
          height={20}
          //   onClick={(e) => handleLikePost(e)}
          className="cursor-pointer"
        />
        {/* <p className="small-medium lg:base-medium">{likes.length}</p> */}
      </div>

      <div className="flex gap-2">
        {isFetching ? (
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

export default PostStats;
