export const revalidate = 10;

import UserProfile from "@/src/components/profile/userProfile";
import Loader from "@/src/components/shared/Loader";
import { getAllLikePost } from "@/src/server/like";
import { getPostById, getUserPosts } from "@/src/server/post";
import { getAllSavePost } from "@/src/server/save";
import { getActiveUserData, getUserById } from "@/src/server/user";
import { PostType } from "@/src/types/post";
import { User } from "@/src/types/user";

async function page({ params }: { params: { id: string } }) {
  try {
    const { user } = await getUserById(params.id || "");
    const { posts } = await getUserPosts(params.id || "");
    const { user: activeUser } = await getActiveUserData();
    const { posts: savedPost } = await getAllSavePost(activeUser?._id || "");
    const { posts: likedPost } = await getAllLikePost(params.id || "");

    const promises = likedPost[0]?.postId?.map((id: string) => getPostById(id));

    const results = await Promise.allSettled(promises);

    const postss = results
      .map((result) => (result.status === "fulfilled" ? result.value : []))
      ?.map((elem) => elem?.post);

    console.log({ likedPost,postss });

    if(!user ||!activeUser||!savedPost||!postss)return <Loader/>

    return (
      <UserProfile
        data={user as User}
        posts={posts as PostType[]}
        activeUser={activeUser as User}
        savedPost={savedPost?.[0]?.postId}
        likedPost={postss}
        likedPostsIds={likedPost[0]?.postId}
      />
    );
  } catch (error) {
    const e = error instanceof Error ? error : new Error("Something went wrong");
    return <div>Something went wrong. Error : {e?.message}</div>;
  }
}

export default page;
