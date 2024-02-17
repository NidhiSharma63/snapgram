"use client";

import { storage } from "@/src/constant/firebase/config";
import { useUserPostIdForSaveAndLike } from "@/src/context/userSaveAndLikeContext";
import { multiFormatDateString } from "@/src/lib/utils";
import { removeLike } from "@/src/server/like";
import { deletePost } from "@/src/server/post";
import { removeSaves } from "@/src/server/save";
import { PostType } from "@/src/types/post";
import { User } from "@/src/types/user";
import { deleteObject, ref } from "firebase/storage";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GridPostList from "../explore/GridPostList";
import Loader from "../shared/Loader";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
function SinglePost({
  post,
  activeUser,
  userWhoCreatedPost,
  relatedPost,
  allUsers,
}: {
  post: PostType;
  activeUser: User;
  userWhoCreatedPost: User;
  relatedPost: PostType[];
  allUsers: User[];
}) {
  const router = useRouter();
  const [createdTime, setCreatedTime] = useState(post?.createdAt.toString());
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [relatedPostToDisplay, setRelatedPost] = useState(relatedPost);
  const { toast } = useToast();
  const { userSavePostId, postsWhichUserLiked, setPostsWhichUserLiked, setUserSavePostId } =
    useUserPostIdForSaveAndLike();

  useEffect(() => {
    setCreatedTime(multiFormatDateString(post?.createdAt.toString()));
  }, [post?.createdAt]);
  const handleBackButton = () => {
    router.back();
  };

  const handleDeletePost = async () => {
    setIsDeletingPost(true);
    try {
      const storageRef = ref(storage, post.file);
      const { error } = await deletePost({ _id: post?._id });
      if (error) {
        toast({
          title: error,
        });
        setIsDeletingPost(false);
        return;
      }

      await deleteObject(storageRef);
      if (postsWhichUserLiked.includes(post._id)) {
        // console.log("postID", post?._id);
        const { error } = await removeLike({ userId: activeUser?._id, postId: post._id });
        if (error) {
          toast({
            title: error,
          });
          setIsDeletingPost(false);
          return;
        }
        const updatedPostsWhichUserLiked = postsWhichUserLiked.filter((id) => id !== post._id);
        setPostsWhichUserLiked(updatedPostsWhichUserLiked);
      }

      setIsDeletingPost(false);
      if (userSavePostId.includes(post._id)) {
        const { error } = await removeSaves({ userId: activeUser?._id, postId: post._id });
        if (error) {
          toast({
            title: error,
          });
          setIsDeletingPost(false);
          return;
        }
        const updatedUserSavePostId = userSavePostId.filter((id) => id !== post._id);
        setUserSavePostId(updatedUserSavePostId);
      }

      router.push("/");
    } catch (error) {
      const e = error instanceof Error ? error : new Error("Something went wrong");
      toast({
        title: e.message,
      });
    }
  };
  // console.log({ post });

  useEffect(() => {
    setRelatedPost(() => {
      return relatedPost?.filter((item: PostType) => item._id !== post._id);
    });
  }, [relatedPost, post._id]);

  return (
    <div className="post_details-container mt-98">
      <div className=" md:flex max-w-5xl w-full">
        <Button onClick={handleBackButton} variant="ghost" className="shad-button_ghost">
          <Image src={"/assets/icons/back.svg"} alt="back" width={24} height={24} />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {!post ? (
        <Loader />
      ) : (
        <div className="post_details-card md:py-10 pt-10">
          <div className="flex py-3 relative h-80 lg:h-[480px] xl:w-[48%] rounded-t-[30px] xl:rounded-l-[24px] xl:rounded-tr-none object-contain dark:bg-dark-1">
            <Image
              src={post?.file}
              alt="creator"
              fill
              priority={true}
              style={{
                objectFit: "contain",
              }}
            />
          </div>

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link href={`/profile/${post?.userId}`} className="flex items-center gap-3">
                <div className="w-[50px] h-[50px] relative">
                  <Image
                    // width={20}
                    fill
                    className="w-full h-full object-cover rounded-full"
                    // height={20}
                    src={userWhoCreatedPost?.avatar || "/assets/icons/profile-placeholder.svg"}
                    alt="creator"
                    // className="rounded-full object-cover"
                  />
                </div>

                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold dark:text-light-1">{userWhoCreatedPost?.username}</p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">{createdTime}</p>•
                    <p className="subtle-semibold lg:small-regular">{post?.location[0]}</p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link href={`/update-post`} className={`${activeUser && activeUser._id !== post?.userId && "hidden"}`}>
                  <Image src={"/assets/icons/edit.svg"} alt="edit" width={24} height={24} />
                </Link>

                {isDeletingPost ? (
                  <Loader />
                ) : (
                  <Button
                    onClick={handleDeletePost}
                    variant="ghost"
                    className={`ghost_details-delete_btn ${activeUser && activeUser._id !== post?.userId && "hidden"}`}>
                    <img src={"/assets/icons/delete.svg"} alt="delete" width={24} height={24} />
                  </Button>
                )}
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption[0]}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags?.[0].split(",").map((tag: string) => {
                  return (
                    <li key={tag} className="text-light-3">
                      {tag.trim()?.length > 0 && "#" + tag.trim()}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="w-full">{/* <PostStats postId={post?._id} likes={post?.likes} /> */}</div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />
        {relatedPostToDisplay?.length > 0 ? (
          <>
            <h3 className="body-bold md:h3-bold w-full my-10">More related Post</h3>
            <GridPostList posts={relatedPostToDisplay} usersData={allUsers} />
          </>
        ) : (
          <h3 className="body-bold md:h3-bold w-full my-10">No Related Posts</h3>
        )}
      </div>
    </div>
  );
}

export default SinglePost;
