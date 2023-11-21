import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import usePost from "@/hooks/query/usePost";
import useSavePost from "@/hooks/query/useSavePost";

function SavePost() {
  const { useGetAllSavePost } = useSavePost();
  const { data: savePosts, isPending: userSavedPostLoading } = useGetAllSavePost();
  const { useGetPostByIds } = usePost();
  const { data: posts, isFetching, isLoading } = useGetPostByIds(savePosts?.[0]?.postId);

  console.log(posts);
  if (isLoading || isFetching || userSavedPostLoading) return <Loader />;
  // console.log(savePosts, "saved post", postsData, "postsdata");
  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img src="/assets/icons/save.svg" width={36} height={36} alt="edit" className="invert-white" />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {!posts ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {posts.length === 0 ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <GridPostList posts={posts} showStats={false} />
          )}
        </ul>
      )}
    </div>
  );
}

export default SavePost;
