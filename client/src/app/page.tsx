import Loader from "@/src/components/shared/Loader";
import PostCard from "@/src/components/shared/PostCard";
import getAllPosts from "@/src/server/getAllPosts";
import getActiveUserData from "@/src/server/user/getActiveUserData";
import getAllUser from "@/src/server/user/getAllUser";
import { User } from "@/src/types/user";

async function Page() {
  const { users, error: usersError } = await getAllUser();
  const { posts, error: postError } = await getAllPosts();
  const { error: activeUserError } = await getActiveUserData();
  console.log({ users, posts });

  // if (usersError || postError) return <div>{usersError || postError}</div>;

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {usersError || postError || activeUserError ? (
            <div>{usersError || postError || activeUserError}</div>
          ) : !users || !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.map((post) => {
                const findCurrentUser = users?.find((item: User) => item._id === post.userId) as User;

                return <PostCard key={post._id} post={post} user={findCurrentUser} />;
              })}
              {posts?.length === 0 ? <p className="text-center">Create posts to see here!</p> : ""}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;

// const handleLogout = async () => {
//   const res = await logout();
//   if (res?.message) {
//     router.push("/");
//   } else {
//     toast({
//       title: res?.error,
//     });
//   }
// };