import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { IPost } from "@/constant/interfaces";
import { useUserDetail } from "@/context/userContext";
import { storage } from "@/firebase/config";
import useAuth from "@/hooks/query/useAuth";
import useLikePost from "@/hooks/query/useLikePost";
import usePost from "@/hooks/query/usePost";
import useSavePost from "@/hooks/query/useSavePost";
import { multiFormatDateString } from "@/lib/utils";
import { deleteObject, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [relatedPost, setRelatedPost] = useState<IPost[]>([]);
  const { userDetails } = useUserDetail();
  const { useGetPostById, useDeletePost, useGetAllPost } = usePost();
  const { useGetUserById, useGetAllUser } = useAuth();
  const { mutateAsync: deletePost, isPending: isDeletingPost } = useDeletePost();
  const { data: post, isPending: isLoading } = useGetPostById(id || "");
  const { data: user, isPending: isUserLoading } = useGetUserById(post?.userId || "");
  const { data: usersData } = useGetAllUser();
  console.log({ usersData }, post?.userId);

  // save post
  const { useRemoveSave, useGetAllSavePost } = useSavePost();
  const { mutateAsync: removePostFromSave, isPending: isRemovingPostFromSaveCollection } = useRemoveSave();
  const { data: savePosts } = useGetAllSavePost();

  // like post
  const { useRemoveLike, useGetAllLike } = useLikePost();
  const { mutateAsync: removePostFromLike, isPending: isRemovingPostFromLikeCollection } = useRemoveLike();
  const { data: likePosts } = useGetAllLike();

  // get all post
  const { data: allPosts, isPending: isLoadingAllPost } = useGetAllPost();
  const { toast } = useToast();

  useEffect(() => {
    setRelatedPost(() => {
      return allPosts?.filter((item: IPost) => item._id !== id);
    });
  }, [allPosts, id]);

  console.log({ user });

  const handleDeletePost = async () => {
    if (post && userDetails) {
      const storageRef = ref(storage, post.file);
      try {
        if (savePosts?.[0]?.postId.includes(post._id)) {
          await removePostFromSave({ postId: post._id, userId: userDetails?._id });
        }
        if (likePosts?.[0]?.postId.includes(post._id)) {
          await removePostFromLike({ postId: post._id, userId: userDetails?._id });
        }
        await deletePost({ _id: post._id });
        await deleteObject(storageRef);
        /** also remove the post from save collection of active user if it is present */

        navigate("/");
      } catch (error) {
        toast({ title: "Please try again" });
      }
    }
  };

  if (isLoading || isUserLoading) return <Loader />;

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button onClick={() => navigate(-1)} variant="ghost" className="shad-button_ghost">
          <img src={"/assets/icons/back.svg"} alt="back" width={24} height={24} />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isLoading || !post ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img src={post?.file} alt="creator" className="post_details-img" />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link to={`/profile/${post?.userId}`} className="flex items-center gap-3">
                <img
                  src={user?.avatar || "/assets/icons/profile-placeholder.svg"}
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold dark:text-light-1">{user?.username}</p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">{multiFormatDateString(post?.createdAt)}</p>•
                    <p className="subtle-semibold lg:small-regular">{post?.location[0]}</p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  to={`/update-post/${post?._id}`}
                  className={`${userDetails && userDetails._id !== post?.userId && "hidden"}`}>
                  <img src={"/assets/icons/edit.svg"} alt="edit" width={24} height={24} />
                </Link>

                {isDeletingPost || isRemovingPostFromSaveCollection || isRemovingPostFromLikeCollection ? (
                  // <Button className="bg-transparent">
                  <Loader />
                ) : (
                  // </Button>
                  <Button
                    onClick={handleDeletePost}
                    variant="ghost"
                    className={`ghost_details-delete_btn ${
                      userDetails && userDetails._id !== post?.userId && "hidden"
                    }`}>
                    <img src={"/assets/icons/delete.svg"} alt="delete" width={24} height={24} />
                  </Button>
                )}
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption[0]}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags?.[0].split(",").map((tag: string) => {
                  return (
                    <li key={tag} className="text-light-3">
                      #{tag.trim()}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="w-full">
              <PostStats postId={post?._id} likes={post?.likes} />
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        {relatedPost?.length > 0 ? (
          <>
            <h3 className="body-bold md:h3-bold w-full my-10">More Related Posts</h3>
            {isLoadingAllPost ? <Loader /> : <GridPostList posts={relatedPost} />}
          </>
        ) : (
          <h3 className="body-bold md:h3-bold w-full my-10">No Related Posts</h3>
        )}
      </div>
    </div>
  );
};

export default PostDetails;
