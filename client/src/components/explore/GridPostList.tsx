"use client";

import { PostType } from "@/src/types/post";
import { User } from "@/src/types/user";
import Link from "next/link";

function GridPostList({
  posts,
  usersData,
  showUser = true,
}: {
  posts: PostType[];
  usersData: User[];
  showUser?: boolean;
}) {
  return (
    <ul className="grid-container">
      {posts?.map((post: PostType) => {
        const findCurrentUser = usersData?.find((item: User) => item?._id === post?.userId);
        return (
          <li key={post?._id} className="relative min-w-80 h-80">
            <Link href={`/posts/${post?._id}`} className="grid-post_link">
              <img src={post?.file} alt="post" className="w-full h-full object-cover" />
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
              {/* <PostStats postId={post?._id} likes={post?.likes} /> */}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default GridPostList;