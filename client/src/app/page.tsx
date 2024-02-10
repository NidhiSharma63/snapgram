import Loader from "@/src/components/shared/Loader";
import PostCard from "@/src/components/shared/PostCard";
import { getAllPosts } from "@/src/server/post";
import { getAllSavePost } from "@/src/server/save";
import { getActiveUserData, getAllUser } from "@/src/server/user";
import { User } from "@/src/types/user";
async function Page() {
  try {
    const { users } = await getAllUser();
    const { posts } = await getAllPosts();
    const { user: userDetails } = await getActiveUserData();
    const { posts: savePosts } = await getAllSavePost(userDetails?._id || "");
    // console.log({ users, posts });
    // console.log({ savePosts }, "From page");

    // if (usersError || postError) return <div>{usersError || postError}</div>;

    return (
      <div className="flex flex-1">
        <div className="home-container">
          <div className="home-posts">
            <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
            {!users || !posts ? (
              <Loader />
            ) : (
              <>
                <PostCard
                  savePosts={savePosts[0]?.postId ?? []}
                  posts={posts}
                  users={users}
                  userDetails={userDetails as User}
                />
                {posts?.length === 0 ? <p className="text-center">Create posts to see here!</p> : ""}
              </>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    const e = error instanceof Error ? error : new Error("Something went wrong");
    return <div>Something went wrong. Error : {e?.message}</div>;
  }
}

export default Page;
