import PostStats from "@/components/shared/PostStats";
import { IPost, IUser } from "@/constant/interfaces";
import { useUserDetail } from "@/context/userContext";
import { multiFormatDateString } from "@/lib/utils";
import { Link } from "react-router-dom";
// type PostCardProps = {
//   post: Models.Document;
// };
export default function PostCard({ post, user }: { post: IPost; user: IUser }) {
  const { userDetails } = useUserDetail();

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/`}>
            <img
              className="rounded-full w-12 lg:h-12"
              alt="creator"
              src={post?.userAvatar || "/assets/icons/profile-placeholder.svg"}
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold dark:text-light-1">{user?.username}</p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-reguler">{multiFormatDateString(post.createdAt.toString())}</p>-
              <p className="subtle-semibold lg:small-reguler">{post.location}</p>
            </div>
          </div>
        </div>
        <Link
          to={`/update-post/${post._id}`}
          className={`${userDetails && userDetails._id !== post.userId && "hidden"} `}>
          <img src="/assets/icons/edit.svg" width={20} height={20} alt="edit" />
        </Link>
      </div>
      <Link to={`/posts/${post._id}`}>
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
        <img className="post-card_img" alt="post image" src={post.file || "/assets/icons/profile-placholder.svg"} />
      </Link>

      <PostStats postId={post?._id} />
    </div>
  );
}
