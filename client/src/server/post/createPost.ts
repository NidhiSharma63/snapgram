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
    // console.log({ "post created": res });
    revalidatePath("/");
    return { post: JSON.parse(JSON.stringify(postCreated)) };
  } catch (err) {
    console.log({ err }, "from create post");
    return { error: err.message };
  }
}

export default createPost;
