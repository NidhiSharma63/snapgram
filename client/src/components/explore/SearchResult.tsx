"use client";

import GridPostList from "@/src/components/explore/GridPostList";
import { PostType } from "@/src/types/post";
import { User } from "@/src/types/user";

function SearchResult({ searchedPosts, usersData }: { searchedPosts: PostType[]; usersData: User[] }) {
  if (searchedPosts.length > 0) {
    return <GridPostList posts={searchedPosts} usersData={usersData} />;
  }
  return <p className="text-light-4 mt-10 text-center w-full">No results found</p>;
}

export default SearchResult;
