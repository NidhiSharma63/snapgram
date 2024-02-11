"use client";

import { PostType } from "@/src/types/post";
import { User } from "@/src/types/user";
import Link from "next/link";
import GridPostList from "../explore/GridPostList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface StabBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium dark:text-light-2">{label}</p>
  </div>
);
function UserProfile({
  data,
  activeUser,
  posts,
  savedPost,
  likedPost,
}: {
  data: User;
  activeUser: User;
  posts: PostType[];
  savedPost: string[];
  likedPost: PostType[];
}) {
  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={data?.avatar || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full object-cover"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full"> @{data.username}</h1>
              <p className="small-regular md:body-medium dark:text-light-3 text-center xl:text-left">{data.email}</p>
              <p className="small-medium  text-center xl:text-left mt-2 max-w-screen-sm">Bio</p>
              <p className="small-medium md:base-medium text-center xl:text-left mt-1 max-w-screen-sm">{data.bio}</p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              {/* <StatBlock value={currentUser.posts.length} label="Posts" /> */}
              <StatBlock value={20} label="Followers" />
              <StatBlock value={20} label="Following" />
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <div className={`${activeUser && activeUser._id !== data._id && "hidden"}`}>
              <Link
                href={`/update-profile`}
                className={`h-12 dark:bg-dark-4 px-5 bg-off-white text-light-1 flex-center gap-2 rounded-lg ${
                  activeUser && activeUser._id !== data._id && "hidden"
                }`}>
                <img src={"/assets/icons/edit.svg"} alt="edit" width={20} height={20} />
                <p className="flex whitespace-nowrap small-medium dark:text-white text-black">Edit Profile</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {activeUser?._id === data?._id ? (
        <Tabs defaultValue="Posts" className="w-full  flex justify-center flex-col">
          <TabsList className="dark:bg-black bg-off-white">
            <TabsTrigger value="Posts">Posts</TabsTrigger>
            <TabsTrigger value="Likes">Likes</TabsTrigger>
          </TabsList>

          <TabsContent value="Posts">
            <GridPostList posts={posts} showUser={false} activeUser={activeUser} showStats savedPost={savedPost} />
          </TabsContent>
          <TabsContent value="Likes">
            <GridPostList posts={likedPost} showUser={false} />
          </TabsContent>
        </Tabs>
      ) : posts.length === 0 && activeUser && activeUser._id !== data?._id ? (
        data?.username + " haven't posted anything"
      ) : (
        "sajnj"
        // <GridPostList posts={posts} showUser={false} />
      )}
    </div>
  );
}

export default UserProfile;
