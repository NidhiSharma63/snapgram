"use client";

import { PostType } from "@/src/types/post";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Loader from "../shared/Loader";
import { Button } from "../ui/button";

function SinglePost({ post }: { post: PostType }) {
  const router = useRouter();

  const handleBackButton = () => {
    router.back();
  };
  return (
    <div className="post_details-container mt-98">
      <div className=" md:flex max-w-5xl w-full">
        <Button onClick={handleBackButton} variant="ghost" className="shad-button_ghost">
          <img src={"/assets/icons/back.svg"} alt="back" width={24} height={24} />
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
              style={{
                objectFit: "contain",
              }}
            />
          </div>

          <div className="post_details-info">
            <div className="flex-between w-full">
              {/* <Link to={`/profile/${post?.userId}`} className="flex items-center gap-3">
            <img
              src={user?.avatar || "/assets/icons/profile-placeholder.svg"}
              alt="creator"
              className="w-8 h-8 lg:w-12 lg:h-12 rounded-full object-cover"
            />
            <div className="flex gap-1 flex-col">
              <p className="base-medium lg:body-bold dark:text-light-1">{user?.username}</p>
              <div className="flex-center gap-2 text-light-3">
                <p className="subtle-semibold lg:small-regular ">{multiFormatDateString(post?.createdAt)}</p>•
                <p className="subtle-semibold lg:small-regular">{post?.location[0]}</p>
              </div>
            </div>
          </Link> */}

              <div className="flex-center gap-4">
                {/* <Link
              to={`/update-post/${post?._id}`}
              className={`${userDetails && userDetails._id !== post?.userId && "hidden"}`}>
              <img src={"/assets/icons/edit.svg"} alt="edit" width={24} height={24} />
            </Link> */}

                {/* {isDeletingPost ? (
              <Loader />
            ) : (
              <Button
                onClick={handleDeletePost}
                variant="ghost"
                className={`ghost_details-delete_btn ${
                  userDetails && userDetails._id !== post?.userId && "hidden"
                }`}>
                <img src={"/assets/icons/delete.svg"} alt="delete" width={24} height={24} />
              </Button>
            )} */}
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption[0]}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags?.[0].split(",").map((tag: string) => {
                  return (
                    <li key={tag} className="text-light-3">
                      #{tag.trim()}
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

        {/* {relatedPost?.length > 0 ? (
      <>
        <h3 className="body-bold md:h3-bold w-full my-10">More Related Posts</h3>
        {isLoadingAllPost || isLoadingAllUser ? (
          <Loader />
        ) : (
          <GridPostList posts={relatedPost} usersData={allUser} />
        )}
      </>
    ) : (
      <h3 className="body-bold md:h3-bold w-full my-10">No Related Posts</h3>
    )} */}
      </div>
    </div>
  );
}

export default SinglePost;
