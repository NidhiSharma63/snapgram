import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import SearchResult from "@/components/shared/SearchResult";
import { Input } from "@/components/ui/input";
import { IPost } from "@/constant/interfaces";
import useAuth from "@/hooks/query/useAuth";
import usePost from "@/hooks/query/usePost";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

function Explore() {
  //   const { ref, inView } = useInView();
  const [search, setSearch] = useState("");
  const { useGetAllPostStatic } = usePost();
  const { useGetAllUser } = useAuth();
  const { data: posts } = useGetAllPostStatic();
  const [searchedPost, setSearchedPost] = useState<IPost[]>([]);
  const { data: usersData } = useGetAllUser();

  useEffect(() => {
    const getAllSearchedPost = posts?.filter((item: IPost) => {
      return item.caption[0].includes(search.trim());
    });
    setSearchedPost(getAllSearchedPost);
  }, [search, posts]);

  if (!posts || !usersData)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="explore-container">
      <div className="explore-inner_conatiner">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-off-white  dark:bg-dark-4">
          <img src="/assets/icons/search.svg" height={24} width={24} alt="explore" />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}></Input>
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl mt-12">
        {search ? (
          <SearchResult searchedPosts={searchedPost} usersData={usersData} />
        ) : (
          <GridPostList key={v4()} posts={posts} usersData={usersData} />
        )}
      </div>
    </div>
  );
}

export default Explore;
