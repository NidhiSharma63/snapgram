"use client";

import GridPostList from "@/src/components/explore/GridPostList";
import SearchResult from "@/src/components/explore/SearchResult";
import { Input } from "@/src/components/ui/input";
import { PostType } from "@/src/types/post";
import { User } from "@/src/types/user";
import { useEffect, useState } from "react";

function Explore({ posts, usersData }: { posts: PostType[]; usersData: User[] }) {
  const [search, setSearch] = useState("");
  const [searchedPost, setSearchedPost] = useState<PostType[]>([]);

  useEffect(() => {
    const getAllSearchedPost = posts?.filter((item: PostType) => {
      return item.caption[0].includes(search.trim());
    });
    setSearchedPost(getAllSearchedPost);
  }, [search, posts]);

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
          <GridPostList posts={posts} usersData={usersData} />
        )}
      </div>
    </div>
  );
}

export default Explore;
