import UserProfile from "@/src/components/profile/userProfile";
import { getUserPosts } from "@/src/server/post";
import { getActiveUserData, getUserById } from "@/src/server/user";
import { PostType } from "@/src/types/post";
import { User } from "@/src/types/user";

async function page({ params }: { params: { id: string } }) {
  try {
    const { user } = await getUserById(params.id || "");
    const { posts } = await getUserPosts(params.id || "");
    const { user: activeUser } = await getActiveUserData();
    return <UserProfile data={user as User} posts={posts as PostType[]} activeUser={activeUser as User} />;
  } catch (error) {
    const e = error instanceof Error ? error : new Error("Something went wrong");
    return <div>Something went wrong. Error : {e?.message}</div>;
  }
}

export default page;
