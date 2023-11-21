import { Link, useNavigate, useParams } from "react-router-dom";

// import { GridPostList } from "@/components/shared";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useUserDetail } from "@/context/userContext";
import { storage } from "@/firebase/config";
import useAuth from "@/hooks/query/useAuth";
import usePost from "@/hooks/query/usePost";
import { multiFormatDateString } from "@/lib/utils";
import { deleteObject, ref } from "firebase/storage";
// import Loader from "@/components/ui/shared/Loader";
// import PostStats from "@/components/ui/shared/PostStats";

// import { useAuthContext } from "@/context/AuthContext";
// import { useDeletePost, useGetPostById } from "@/lib/react-query/queryAndMutations";
// import { multiFormatDateString } from "@/lib/utils";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  //   const { user } = useAuthContext();
  const { userDetails } = useUserDetail();
  const { useGetPostById, useDeletePost } = usePost();
  const { useGetUserById } = useAuth();
  const { mutateAsync: deletePost, isPending: isDeletingPost } = useDeletePost();
  const { data: post, isPending: isLoading } = useGetPostById(id || "");
  const { data: user, isPending: isUserLoading } = useGetUserById(post?.userId || "");
  const { toast } = useToast();

  // console.log(user.id === post?.creator.id, "user id : ", user.id, "post id", post?.creator.id);
  // const { data: userPosts, isLoading: isUserPostLoading } = useGetUserPosts(post?.creator.$id);
  //   const { mutate: deletePost } = useDeletePost();

  // const relatedPosts = userPosts?.documents.filter((userPost) => userPost.$id !== id);

  const handleDeletePost = async () => {
    if (post) {
      const storageRef = ref(storage, post.file);
      try {
        await deleteObject(storageRef);
        await deletePost({ _id: post._id });

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

                {isDeletingPost ? (
                  <Button className="bg-transparent">
                    <Loader />
                  </Button>
                ) : (
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

            <div className="w-full">{/* <PostStats post={post} userId={user.id} /> */}</div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">More Related Posts</h3>
        {/* {isUserPostLoading || !relatedPosts ? <Loader /> : <GridPostList posts={relatedPosts} />} */}
      </div>
    </div>
  );
};

export default PostDetails;
