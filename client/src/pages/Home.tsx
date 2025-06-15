import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { IPost, IUser } from "@/constant/interfaces";
import { usePostContext } from "@/context/postsProvider";
import useAuth from "@/hooks/query/useAuth";
import { debounce } from "lodash";
import { useEffect, useRef } from "react";

function Home() {
  const {
    finalPostsArr,
    isPostLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasFetched,
    setHasFetched,
  } = usePostContext();
  const { useGetAllUser } = useAuth();
  const { data: usersData } = useGetAllUser();
  const homeRef = useRef(null);

  useEffect(() => {
    const checkIfTargetIsInView = () => {
      const allCaptions = document.querySelectorAll(".post-caption");
      const lastPostTitle =
        finalPostsArr[finalPostsArr.length - 1]?.caption?.[0];

      allCaptions.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isInView =
          rect.top >= 0 &&
          rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight);

        const isTarget = el.textContent?.trim() === lastPostTitle;

        if (isInView && isTarget && !isFetchingNextPage && !hasFetched) {
          fetchNextPage();
          setHasFetched(true);
        }
      });
    };

    const debouncedCheck = debounce(checkIfTargetIsInView, 200); // wait 200ms after scroll stop

    const currentRef = homeRef.current;
    currentRef?.addEventListener("scroll", debouncedCheck);

    return () => {
      currentRef?.removeEventListener("scroll", debouncedCheck);
    };
  }, [finalPostsArr, isFetchingNextPage, fetchNextPage, hasFetched]);

  return (
    <div className="flex flex-1">
      <div className="home-container" ref={homeRef}>
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
                return (
                  <PostCard key={post._id} post={post} user={findCurrentUser} />
                );
              })}
              {finalPostsArr?.length === 0 ? (
                <p className="text-center">Create posts to see here!</p>
              ) : (
                ""
              )}
            </ul>
          )}
          {isFetchingNextPage && <Loader />}
        </div>
      </div>
    </div>
  );
}

export default Home;
