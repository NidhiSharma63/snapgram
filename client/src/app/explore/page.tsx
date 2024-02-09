import Explore from "@/src/components/explore/Explore";
import Loader from "@/src/components/shared/Loader";
import { getAllPosts } from "@/src/server/post";
import { getAllUser } from "@/src/server/user";
import { PostType } from "@/src/types/post";
import { User } from "@/src/types/user";

async function Page() {
  let userPosts: PostType[] | undefined = [];
  let users: User[] | undefined = [];
  let isError = false;
  try {
    const { posts: postsData } = await getAllPosts();
    const { users: usersData } = await getAllUser();

    userPosts = postsData;
    users = usersData;
  } catch (error) {
    isError = true;
  }

  if (isError) return <div className="flex-center w-full h-full">Something went wrong</div>;

  if ((!userPosts || !users) && !isError)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  if (userPosts?.length === 0)
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <div className="home-posts">
            <p className="text-center">Create posts to see here!</p>
          </div>
        </div>
      </div>
    );
  return <Explore posts={userPosts as PostType[]} usersData={users as User[]} />;
}

export default Page;
