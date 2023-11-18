import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { Input } from "@/components/ui/input";
import usePost from "@/hooks/query/usePost";
import { v4 } from "uuid";
// import GridPostList from "@/components/ui/shared/GridPostList";
// import SearchResult from "@/components/ui/shared/SearchResult";
// import useDebounce from "@/hooks/useDebounce";
// import { useGetPosts, useSearchPost } from "@/lib/react-query/queryAndMutations";

function Explore() {
  //   const { ref, inView } = useInView();
  //   const [search, setSearch] = useState("");
  //   const debounceValue = useDebounce(search, 500);
  //   const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();
  //   const { data: searchedPost, isFetching: isSearchFetching } = useSearchPost(debounceValue);
  //   const shouldShowSearchResults = search !== "";
  //   const shouldShowPosts = !shouldShowSearchResults && posts?.pages.every((item) => item.documents.length === 0);
  // console.log({ posts });

  //   useEffect(() => {
  //     if (inView && !search) {
  //       fetchNextPage();
  //     }
  //   }, [inView, search]);
  const { useGetAllPost } = usePost();
  const { data: posts } = useGetAllPost();
  console.log(posts);
  if (!posts)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="explore-container">
      <div className="explore-inner_conatiner">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img src="/assets/icons/search.svg" height={24} width={24} alt="explore" />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
            // value={search}
            // onChange={(e) => setSearch(e.target.value)}
          ></Input>
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl mt-12">
        {/* {shouldShowSearchResults ? (
          <SearchResult isSearchFetching={isSearchFetching} searchedPosts={searchedPost} />
        ) : (
            )} */}
        {<GridPostList key={v4()} posts={posts} />}
      </div>
      {/* {hasNextPage && !search && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )} */}
    </div>
  );
}

export default Explore;
