// "use client";
import SinglePost from "@/src/components/post/SinglePost";
import { getPostById } from "@/src/server/post";

async function page({ params }: { params: { id: string } }) {
  const { post } = await getPostById(params.id || "");
  return <SinglePost post={post} />;
}

export default page;
