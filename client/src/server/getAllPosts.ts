import Post from "@/src/schema/postSchema";
import { PostTypeRes } from "@/src/types/post";

async function getAllPosts(): Promise<PostTypeRes> {
  try {
    const getAllPost = await Post.find().sort({ createdAt: -1 }).setOptions({ lean: true });
    return { posts: JSON.parse(JSON.stringify(getAllPost)) };
  } catch (err) {
    return { error: err.message };
  }
}

export default getAllPosts;
