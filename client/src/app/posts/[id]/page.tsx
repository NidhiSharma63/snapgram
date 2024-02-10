// "use client";
import SinglePost from "@/src/components/post/SinglePost";
import { getAllPosts, getPostById } from "@/src/server/post";
import { getActiveUserData, getAllUser, getUserById } from "@/src/server/user";
import { PostType } from "@/src/types/post";
import { User } from "@/src/types/user";

async function page({ params }: { params: { id: string } }) {
  try {
    const { post } = await getPostById(params.id || "");
    const { user: userWhoCreatedPost } = await getUserById(post?.userId || "");
    const { user } = await getActiveUserData();
    const { posts } = await getAllPosts();
    const { users } = await getAllUser();

    return (
      <SinglePost
        post={post}
        activeUser={user as User}
        userWhoCreatedPost={userWhoCreatedPost as User}
        relatedPost={posts as PostType[]}
        allUsers={users as User[]}
      />
    );
  } catch (error) {
    const e = error instanceof Error ? error : new Error("Something went wrong");
    return <div>Something went wrong. Error : {e?.message}</div>;
  }
}

export default page;
