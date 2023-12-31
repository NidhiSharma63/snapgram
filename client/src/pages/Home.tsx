import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { IPost, IUser } from "@/constant/interfaces";
import useAuth from "@/hooks/query/useAuth";
import usePost from "@/hooks/query/usePost";

function Home() {
  const { useGetAllPost } = usePost();
  const { data: posts, isPending: isPostLoading } = useGetAllPost();
  const { useGetAllUser } = useAuth();
  const { data: usersData } = useGetAllUser();

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {(isPostLoading && !posts) || !usersData ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.map((post: IPost) => {
                const findCurrentUser = usersData?.find((item: IUser) => item._id === post.userId);
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

export default Home;
