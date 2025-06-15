import { IPost } from "@/constant/interfaces";
import usePost from "@/hooks/query/usePost";
import { createContext, useContext, useEffect, useState } from "react";

interface PostContextType {
  finalPostsArr: IPost[];
  isFetchingNextPage: boolean;
  isPostLoading: boolean;
}

const PostContext = createContext<PostContextType | null>(null);

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
  const { useGetAllPost } = usePost();
  const [pageParams, setPagesParams] = useState(1);
  const {
    data,
    isPending: isPostLoading,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetAllPost(pageParams);
  const [finalPostsArr, setFinalPostsArr] = useState<IPost[]>([]);

  // initially pageParams (default) will be 1 and then it will be updated
  // when data is available show that for fetching next page we have to update pageParams by 1
  // to pass the BE
  useEffect(() => {
    const pagesParams = data?.pageParams;
    setPagesParams(pagesParams?.[pagesParams?.length - 1] + 1);
  }, [data]);

  // get all upcoming post and insert them into a single array
  useEffect(() => {
    // console.log(data, pageParams);
    const output =
      data?.pages
        ?.map((elem) => {
          return elem.data;
        })
        .flat(1) ?? [];
    const getAllUpcomingPosts =
      data?.pages?.filter((elem) => {
        return elem.currentPage === pageParams - 1;
      })?.[0]?.data ?? [];

    if (!getAllUpcomingPosts.length) {
      return;
    }
    setFinalPostsArr(output);
  }, [pageParams, data]);

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
    <PostContext.Provider
      value={{
        finalPostsArr,
        isFetchingNextPage,
        isPostLoading,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (context === null)
    throw new Error("usePostContext must be used inside PostProvider");
  return context;
};
