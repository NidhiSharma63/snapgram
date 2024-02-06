"use server";

import connectDB from "@/src/lib/connectToMongodb";
import Post from "@/src/schema/postSchema";
import { PostTypeForCreatingPost, PostTypeRes } from "@/src/types/post";
import { revalidatePath } from "next/cache";

/** create post */
async function createPost(values: PostTypeForCreatingPost) {
  try {
    await connectDB();
    const { file, userId, tags, caption, location, createdAt, userAvatar } = values;
    if (!file) throw new Error("Image is Missiing");

    const postCreated = new Post({
      file,
      userId,
      tags: tags ?? [],
      location: location ?? [],
      caption: caption ?? [],
      createdAt,
      userAvatar,
      likes: [],
    });
    await postCreated.save();
    revalidatePath("/");
    return { post: JSON.parse(JSON.stringify(postCreated)) };
  } catch (error) {
    return Promise.reject(error);
  }
}

/** get All post */
async function getAllPosts(): Promise<PostTypeRes> {
  try {
    await connectDB();
    const getAllPost = await Post.find().sort({ createdAt: -1 }).setOptions({ lean: true });
    return { posts: JSON.parse(JSON.stringify(getAllPost)) };
  } catch (err) {
    return { error: err.message };
  }
}

/** get post by ID */
async function getPostById(id: string) {
  try {
    await connectDB();
    const post = await Post.findOne({ _id: id });
    return { post: JSON.parse(JSON.stringify(post)) };
  } catch (error) {
    return Promise.reject(error);
  }
}
export { createPost, getAllPosts, getPostById };
