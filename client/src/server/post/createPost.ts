"use server";

import connectDB from "@/src/lib/connectToMongodb";
import Post from "@/src/schema/postSchema";
import { PostTypeForCreatingPost } from "@/src/types/post";
import { revalidatePath } from "next/cache";

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

export default createPost;
