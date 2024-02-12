import Explore from "@/src/components/explore/Explore";
import Loader from "@/src/components/shared/Loader";
import { getAllPosts } from "@/src/server/post";
import { getAllUser } from "@/src/server/user";
import { PostType } from "@/src/types/post";
import { User } from "@/src/types/user";

async function Page() {
  try {
    const { posts } = await getAllPosts();
    const { users, error: getAllUserError } = await getAllUser();

    if (getAllUserError) {
      return (
        <div className="flex-center w-full h-full">
          <div>Something went wrong. Error : {getAllUserError}</div>
        </div>
      );
    }
    if (!posts || !users)
      return (
        <div className="flex-center w-full h-full">
          <Loader />
        </div>
      );

    if (posts?.length === 0)
      return (
        <div className="flex flex-1">
          <div className="home-container">
            <div className="home-posts">
              <p className="text-center">Create posts to see here!</p>
            </div>
          </div>
        </div>
      );
    return <Explore posts={posts as PostType[]} usersData={users as User[]} />;
  } catch (error) {
    const e = error instanceof Error ? error : new Error("Something went wrong");
    return <div>Something went wrong. Error : {e?.message}</div>;
  }
}

export default Page;
