import GridPostList from "@/src/components/explore/GridPostList";
import Loader from "@/src/components/shared/Loader";
import { getPostById } from "@/src/server/post";
import { getAllSavePost } from "@/src/server/save";
import { getActiveUserData } from "@/src/server/user";

async function page() {
  try {
    const { user, error: getActiveUserError } = await getActiveUserData();
    const { posts, error } = await getAllSavePost(user?._id || "");

    if (error || getActiveUserError) {
      return (
        <div className="saved-container">
          <p className="text-light-4">Something went wrong {error ?? getActiveUserError}</p>
        </div>
      );
    }
    if (!posts[0])
      return (
        <div className="saved-container">
          <p className="text-light-4">No available posts</p>
        </div>
      );
    const promises = posts[0] && posts?.[0]?.postId?.map((id: string) => getPostById(id));

    const results = await Promise.allSettled(promises);

    const postss = results
      ?.map((result) => (result.status === "fulfilled" ? result.value : []))
      ?.map((elem) => elem?.post);

    return (
      <div className="saved-container">
        <div className="flex gap-2 w-full max-w-5xl">
          <img src="/assets/icons/save.svg" width={36} height={36} alt="edit" className="invert-white" />
          <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
        </div>

        {
          !posts ? (
            <Loader />
          ) : // <ul className="w-full flex justify-center max-w-5xl gap-9">
          postss?.length === 0 ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <GridPostList activeUser={user} posts={postss} savedPost={posts?.[0]?.postId} showStats />
          )
          // </ul>
        }
      </div>
    );
  } catch (error) {
    const e = error instanceof Error ? error : new Error("Something went wrong");
    return <div>Something went wrong. Error : {e?.message}</div>;
  }
}

export default page;