import Post from "@/src/schema/postSchema";
import { PostType } from "@/src/types/post";

async function getAllPosts(): Promise<PostType> {
  try {
    const getAllPost = await Post.find().sort({ createdAt: -1 }).setOptions({ lean: true });
    throw new Error("User not found");
    return { posts: JSON.parse(JSON.stringify(getAllPost)) };
  } catch (err) {
    return { error: err.message };
  }
}

export default getAllPosts;
