import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { IPost, IUser } from "@/constant/interfaces";
import useAuth from "@/hooks/query/useAuth";
import usePost from "@/hooks/query/usePost";
import { useEffect, useState } from "react";

function triggerWhenNidhiJiVisible() {
  console.log("🚀 'Nidhi ji' is visible now!");
}

function Home() {
  const { useGetAllPost } = usePost();
  const [pageParams, setPagesParams] = useState(1);
  const {
    data,
    isPending: isPostLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetAllPost(pageParams);
  const { useGetAllUser } = useAuth();
  const { data: usersData } = useGetAllUser();
  const [finalPostsArr, setFinalPostsArr] = useState<IPost[]>([]);

  useEffect(() => {
    const pagesParams = data?.pageParams;
    setPagesParams(pagesParams?.[pagesParams?.length - 1] + 1);
    return data?.pages?.[0]?.data ?? [];
  }, [data]);

  // get all upcoming post and insert them into a single array
  useEffect(() => {
    // console.log(data);
    const getAllUpcomingPosts =
      data?.pages?.filter((elem) => {
        console.log(elem.currentPage, pageParams);
        return elem.currentPage === pageParams - 1;
      })?.[0]?.data ?? [];

    if (!getAllUpcomingPosts.length) {
      return;
    }
    setFinalPostsArr((prev) => {
      return [...prev, ...getAllUpcomingPosts];
    });
    console.log(getAllUpcomingPosts, "getAllUpcomingPosts");
  }, [pageParams, data]);

  console.log("final posts to present on screen", finalPostsArr);

  // console.log({ posts });
  // check if last post title is in index or not
  useEffect(() => {
    // Select all .post-caption elements
    const allCaptions = document.querySelectorAll(".post-caption");

    // Select the last caption
    const lastPostTitle = finalPostsArr[finalPostsArr.length - 1]?.caption?.[0];

    // Create an IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;

          // ✅ Check if this specific caption has lastPostTitle
          if (
            entry.isIntersecting &&
            el.textContent?.trim() === lastPostTitle
          ) {
            fetchNextPage();
          }
        });
      },
      {
        root: null, // viewport
        threshold: 0.1, // thoda sa dikhna bhi chalega
      }
    );

    allCaptions.forEach((el) => {
      observer.observe(el);
    });
  }, [finalPostsArr, fetchNextPage]);

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {(isPostLoading && !finalPostsArr) || !usersData ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {finalPostsArr?.map((post: IPost) => {
                const findCurrentUser = usersData?.find(
                  (item: IUser) => item._id === post.userId
                );
                return <PostCard post={post} user={findCurrentUser} />;
              })}
              {finalPostsArr?.length === 0 ? (
                <p className="text-center">Create posts to see here!</p>
              ) : (
                ""
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
