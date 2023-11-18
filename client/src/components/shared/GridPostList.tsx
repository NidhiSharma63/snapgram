import { IPost } from "@/constant/interfaces";
import { useUserDetail } from "@/context/userContext";
import useAuth from "@/hooks/query/useAuth";
import { Link } from "react-router-dom";

interface IGridPostListProps {
  posts: IPost[];
  showUser?: boolean;
  showStats?: boolean;
}
export default function GridPostList({ posts, showUser = true, showStats = true }: IGridPostListProps) {
  const { userDetails } = useUserDetail();
  const { useGetUserById } = useAuth();
  //   const {data:userData} = useGetUserById();

  return (
    <ul className="grid-container">
      {posts?.map((post: IPost) => {
        console.log(post);
        return (
          <li key={post._id} className="relative min-w-80 h-80">
            <Link to={`/posts/${post._id}`} className="grid-post_link">
              <img src={post.file} alt="post" className="w-full h-full object-cover" />
            </Link>
            <div className="grid-post_user">
              {showUser && (
                <div className="flex items-center justify-start gap-2 flex-1">
                  <img src={post.userAvatar} alt="creator" className="h-8 w-8 rounded-full" />
                  <p className="line-clamp-1 text-white">nidhi</p>
                </div>
              )}
              {/* {showStats && <PostStats post={post} userId={user.id} />} */}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
