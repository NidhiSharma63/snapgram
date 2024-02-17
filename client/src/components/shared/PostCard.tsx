"use client";

import PostStats from "@/src/components/postStats";
import ShowTime from "@/src/components/shared/showTime";
import { PostType } from "@/src/types/post";
import { User } from "@/src/types/user";
import Image from "next/image";
import Link from "next/link";
// type PostCardProps = {
//   post: Models.Document;
// };
export default function PostCard({
  posts,
  users,
  userDetails,
  savePosts,
  likePosts,
}: {
  posts: PostType[];
  users: User[];
  userDetails: User;
  savePosts: string[];
  likePosts: string[];
}) {
  return (
    <ul className="flex flex-col flex-1 gap-9 w-full">
      {posts.map((post: PostType) => {
        const user = users?.find((item: User) => item._id === post.userId) as User;
        return (
          <div className="post-card" key={post._id}>
            <div className="flex-between">
              <div className="flex items-center gap-3">
                <Link href={`/profile/${post?.userId}`}>
                  <div style={{ width: "50px", height: "50px", position: "relative" }}>
                    <Image
                      // width={40}
                      priority
                      // className="post-card_img"
                      // height={40}
                      fill
                      className="rounded-full object-cover"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      alt="creator"
                      // style={{ height: "40px !important" }}
                      // style={{ objectFit: "cover", height: "20px!important" }}
                      src={user?.avatar || "/assets/icons/profile-placeholder.svg"}
                    />
                  </div>
                </Link>
                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold dark:text-light-1">{user?.username}</p>
                  <div className="flex-center gap-2 text-light-3">
                    <ShowTime createdAt={post?.createdAt} />-
                    <p className="subtle-semibold lg:small-reguler">{post.location[0]}</p>
                  </div>
                </div>
              </div>
              <Link
                href={`/update-post/${post._id}`}
                className={`${userDetails && userDetails._id !== post.userId && "hidden"} `}>
                <Image src="/assets/icons/edit.svg" width={20} height={20} alt="edit" />
              </Link>
            </div>
            <Link href={`/posts/${post._id}`} className="flex flex-col items-center">
              <div className="small-medium lg:base-meduim py-5 w-full">
                <p>{post.caption[0]}</p>
                <ul className="flex gap-1 mt-2">
                  {post.tags[0].split(",").map((tag: string) => {
                    return (
                      <li key={tag} className="text-light-3">
                        {tag.trim()?.length > 0 && "#" + tag.trim()}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div style={{ maxWidth: "500px", minWidth: "250px", height: "500px", position: "relative" }}>
                <Image
                  // onLoad={() => {
                  //   return <Loader />;
                  // }}
                  priority={true}
                  fill
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  alt="post image"
                  src={post?.file || "/assets/icons/profile-placholder.svg"}
                />
              </div>
            </Link>

            <PostStats
              totalLike={post?.likes?.length}
              savePosts={savePosts}
              likes={likePosts}
              postId={post?._id}
              activeUser={userDetails}
            />
          </div>
        );
      })}
    </ul>
  );
}
