"use client";

// import { toast } from "@/src/components/ui/use-toast";
// import logout from "@/src/server/authActions/logout";
import getUserData from "@/src/server/getUserData";
async function Page() {
  // const router = useRouter();
  const data = await getUserData();
  console.log({ data });
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
  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {/* {(isPostLoading && !posts) || !usersData ? (
          <Loader />
        ) : (
          <ul className="flex flex-col flex-1 gap-9 w-full">
            {posts?.map((post: IPost) => {
              const findCurrentUser = usersData?.find((item: IUser) => item._id === post.userId);
              return <PostCard key={post._id} post={post} user={findCurrentUser} />;
            })}
            {posts?.length === 0 ? <p className="text-center">Create posts to see here!</p> : ""}
          </ul>
        )} */}
        </div>
      </div>
    </div>
  );
}

export default Page;
