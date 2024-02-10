"use client";

import { PostType } from "@/src/types/post";
import { User } from "@/src/types/user";
import Image from "next/image";
import Link from "next/link";
import PostStats from "../postStats";

function GridPostList({
  posts,
  usersData,
  showUser = true,
  activeUser,
  savedPost,
  showStats = false,
}: {
  posts: PostType[];
  usersData?: User[];
  showUser?: boolean;
  activeUser?: User;
  savedPost?: string[];
  showStats?: boolean;
}) {
  return (
    <ul className="grid-container gap-11">
      {posts?.map((post: PostType) => {
        const findCurrentUser = usersData?.find((item: User) => item?._id === post?.userId);
        return (
          <li key={post?._id} className="relative h-80">
            <Link href={`/posts/${post?._id}`} className="grid-post_link">
              <Image
                priority
                width={200}
                height={200}
                src={post?.file}
                alt="post"
                className="w-full h-full object-cover"
              />
            </Link>
            <div className="grid-post_user">
              {showUser && (
                <div className="flex items-center justify-start gap-2 flex-1">
                  <img
                    src={findCurrentUser?.avatar || "/assets/icons/profile-placeholder.svg"}
                    alt="creatojkghkjr"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <p className="line-clamp-1 text-white">{findCurrentUser?.username}</p>
                </div>
              )}

              {/* {showStats && <PostStats post={post} userId={user.id} />} */}
              {showStats && (
                <PostStats
                  postId={post?._id}
                  likes={post?.likes}
                  activeUser={activeUser as User}
                  savePosts={savedPost as string[]}
                />
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default GridPostList;
