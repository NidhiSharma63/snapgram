import useSavePost from "@/hooks/query/useSavePost";
import { useState } from "react";
import Loader from "./Loader";

function Newc({ postId }: { postId: string }) {
  const { useAddSave, useRemoveSave, useGetAllSavePost } = useSavePost();
  /** after saving and removing items also invalidate the save query so that we can fetch updated data from  useGetAllSavePost*/
  const { mutateAsync: addSave, isPending: isSavingInSaveCollection } = useAddSave();
  const { mutateAsync: removeSave } = useRemoveSave();
  const [postIdOnWhichUserClick, setPostIdOnWhichUserClick] = useState<string>("");
  const { data: SavePostData, isFetching: fetchingSaveItems } = useGetAllSavePost();

  const handleAddSavePost = async () => {
    setPostIdOnWhichUserClick(postId);
    await addSave({ postId });
    setPostIdOnWhichUserClick("");
  };

  const handleRemoveSavePost = async () => {
    setPostIdOnWhichUserClick(postId);
    await removeSave({ postId });
    setPostIdOnWhichUserClick("");
  };
  return (
    <div className="flex gap-2">
      {(fetchingSaveItems || isSavingInSaveCollection) && postId === postIdOnWhichUserClick ? (
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
  );
}

export default Newc;
