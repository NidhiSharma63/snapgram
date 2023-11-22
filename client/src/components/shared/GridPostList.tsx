import PostStats from "@/components/shared/PostStats";
import { IPost, IUser } from "@/constant/interfaces";
import { Link } from "react-router-dom";

interface IGridPostListProps {
  posts: IPost[];
  usersData?: IUser[];
  showUser?: boolean;
}
export default function GridPostList({ posts, showUser = true, usersData }: IGridPostListProps) {
  //   const { useGetAllUser } = useAuth();
  //   const { data: usersData } = useGetAllUser();

  return (
    <ul className="grid-container">
      {posts?.map((post: IPost) => {
        const findCurrentUser = usersData?.find((item) => item?._id === post?.userId);
        return (
          <li key={post?._id} className="relative min-w-80 h-80">
            <Link to={`/posts/${post?._id}`} className="grid-post_link">
              <img src={post?.file} alt="post" className="w-full h-full object-cover" />
            </Link>
            <div className="grid-post_user">
              {showUser && (
                <div className="flex items-center justify-start gap-2 flex-1">
                  <img
                    src={findCurrentUser?.avatar || "/assets/icons/profile-placeholder.svg"}
                    alt="creatojkghkjr"
                    className="h-8 w-8 rounded-full"
                  />
                  <p className="line-clamp-1 text-white">{findCurrentUser?.username}</p>
                </div>
              )}

              {/* {showStats && <PostStats post={post} userId={user.id} />} */}
              <PostStats postId={post?._id} likes={post?.likes} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
