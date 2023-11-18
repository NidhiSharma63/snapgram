import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import usePost from "@/hooks/query/usePost";

function Home() {
  const { useGetAllPost } = usePost();
  const { data: posts, isPending: isPostLoading } = useGetAllPost();

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.map((post) => {
                // console.log({ post });
                return <PostCard key={post._id} post={post} />;
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
