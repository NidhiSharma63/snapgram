import { IPost } from "@/constant/interfaces";
import usePost from "@/hooks/query/usePost";
import { createContext, useContext, useEffect, useState } from "react";

interface PostContextType {
  finalPostsArr: IPost[];
  isFetchingNextPage: boolean;
  isPostLoading: boolean;
  hasFetched: boolean;
  setHasFetched: (val: boolean) => void;
  fetchNextPage: () => void;
}

const PostContext = createContext<PostContextType | null>(null);

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
  const { useGetAllPost } = usePost();
  const [pageParams, setPagesParams] = useState(1);
  const [hasFetched, setHasFetched] = useState(false);
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
    setFinalPostsArr(output);
    setHasFetched(false);
  }, [pageParams, data]);
  return (
    <PostContext.Provider
      value={{
        finalPostsArr,
        isFetchingNextPage,
        isPostLoading,
        fetchNextPage,
        hasFetched,
        setHasFetched,
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
