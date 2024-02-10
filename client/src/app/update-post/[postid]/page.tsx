import PostForm from "@/src/components/form/PostForm";
import Loader from "@/src/components/shared/Loader";
import { getPostById } from "@/src/server/post";
import { getActiveUserData } from "@/src/server/user";
import { User } from "@/src/types/user";

async function Page({ params }: { params: { postId: string } }) {
  try {
    const { post } = await getPostById(params.postId || "");
    const { user } = await getActiveUserData();

    if (!post) return <Loader />;
    // If the post was fetched successfully, render the component with the post data
    return (
      <div className="flex flex-1">
        <div className="common-container">
          <div className="max-w-5xl flex-start gap-3 justify-start w-full">
            <img src="/assets/icons/add-post-light.svg" alt="add" height={36} width={36} />
            <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
          </div>
          <PostForm action="Update" post={post} userDetails={user as User} />
        </div>
      </div>
    );
  } catch (error) {
    const e = error instanceof Error ? error : new Error("Something went wrong");
    return <div>Something went wrong. Error : {e?.message}</div>;
  }
}

export default Page;
