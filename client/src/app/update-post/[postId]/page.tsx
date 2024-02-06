import PostForm from "@/src/components/form/PostForm";
import Loader from "@/src/components/shared/Loader";
import { getPostById } from "@/src/server/post";
import { getActiveUserData } from "@/src/server/user";
import { User } from "@/src/types/user";

async function Page({ params }: { params: { postId: string } }) {
  let post;
  let userDetails;
  try {
    // Attempt to fetch the post using the provided ID
    const result = await getPostById(params.postId || "");
    const { user } = await getActiveUserData();
    post = result.post;
    userDetails = user;
  } catch (error) {
    return <div>Error loading post. Please try again later.</div>;
  }

  if (!post) return <Loader />;
  // If the post was fetched successfully, render the component with the post data
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img src="/assets/icons/add-post-light.svg" alt="add" height={36} width={36} />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>
        <PostForm action="Update" post={post} userDetails={userDetails as User} />
      </div>
    </div>
  );
}

export default Page;
