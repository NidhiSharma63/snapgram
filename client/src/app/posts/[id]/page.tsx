// "use client";
import SinglePost from "@/src/components/post/SinglePost";
import { getAllPosts, getPostById } from "@/src/server/post";
import { getActiveUserData, getAllUser, getUserById } from "@/src/server/user";
import { PostType } from "@/src/types/post";
import { User } from "@/src/types/user";

async function page({ params }: { params: { id: string } }) {
  try {
    const { post } = await getPostById(params.id || "");
    const { user: userWhoCreatedPost, error: getUserByIdError } = await getUserById(post?.userId || "");
    const { user, error: getActiveUserErrorr } = await getActiveUserData();
    const { posts, error: getAllPostsError } = await getAllPosts();
    const { users, error: getAllUserError } = await getAllUser();

    if (getAllUserError || getActiveUserErrorr || getUserByIdError || getAllPostsError) {
      const errorMessage = getAllUserError ?? getActiveUserErrorr ?? getUserByIdError ?? getAllPostsError;
      return <div>Something went wrong. Error : {errorMessage}</div>;
    }

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
