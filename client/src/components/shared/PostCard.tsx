"use client";

import { PostType } from "@/src/types/post";
import { User } from "@/src/types/user";
import Image from "next/image";
import Link from "next/link";
import ShowTime from "./showTime";
// type PostCardProps = {
//   post: Models.Document;
// };
export default function PostCard({
  posts,
  users,
  userDetails,
}: {
  posts: PostType[];
  users: User[];
  userDetails: User;
}) {
  //   const { userDetails } = useUserDetail();
  // const { user: userDetails } = await getActiveUserData();

  return (
    <ul className="flex flex-col flex-1 gap-9 w-full">
      {posts.map((post: PostType) => {
        const user = users?.find((item: User) => item._id === post.userId) as User;

        return (
          <div className="post-card" key={post._id}>
            <div className="flex-between">
              <div className="flex items-center gap-3">
                <Link href={`/profile/${post?.userId}`}>
                  <Image
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                    alt="creator"
                    src={user?.avatar || "/assets/icons/profile-placeholder.svg"}
                  />
                </Link>
                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold dark:text-light-1">{user?.username}</p>
                  <div className="flex-center gap-2 text-light-3">
                    <ShowTime createdAt={post?.createdAt} />-
                    <p className="subtle-semibold lg:small-reguler">{post.location}</p>
                  </div>
                </div>
              </div>
              <Link
                href={`/update-post/${post._id}`}
                className={`${userDetails && userDetails._id !== post.userId && "hidden"} `}>
                <Image src="/assets/icons/edit.svg" width={20} height={20} alt="edit" />
              </Link>
            </div>
            <Link href={`/posts/${post._id}`}>
              <div className="small-medium lg:base-meduim py-5">
                <p>{post.caption}</p>
                <ul className="flex gap-1 mt-2">
                  {post.tags?.[0].split(",").map((tag: string) => {
                    return (
                      <li key={tag} className="text-light-3">
                        #{tag.trim()}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <Image
                width={500}
                height={500}
                className="post-card_img"
                alt="post image"
                src={post?.file || "/assets/icons/profile-placholder.svg"}
              />
            </Link>

            {/* <PostStats likes={post?.likes} postId={post?._id} /> */}
          </div>
        );
      })}
    </ul>
  );
}
