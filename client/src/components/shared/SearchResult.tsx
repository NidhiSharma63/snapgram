import { IPost, IUser } from "@/constant/interfaces";
import GridPostList from "./GridPostList";

interface ISearchResultProps {
  searchedPosts: IPost[];
  usersData: IUser[];
}

export default function SearchResult({ searchedPosts, usersData }: ISearchResultProps) {
  if (searchedPosts.length > 0) {
    return <GridPostList posts={searchedPosts} usersData={usersData} />;
  }
  return <p className="text-light-4 mt-10 text-center w-full">No results found</p>;
}
