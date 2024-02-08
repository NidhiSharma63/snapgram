"use server";

import connectDB from "@/src/lib/connectToMongodb";
import PostCollection from "@/src/schema/postSchema";
import { PostTypeForCreatingPost, PostTypeRes, UpdatePostType } from "@/src/types/post";
import { revalidatePath } from "next/cache";

/** create post */
async function createPost(values: PostTypeForCreatingPost) {
  try {
    await connectDB();
    const { file, userId, tags, caption, location, createdAt, userAvatar } = values;
    if (!file) throw new Error("Image is Missiing");

    const postCreated = new PostCollection({
      file,
      userId,
      tags: tags ?? "",
      location: location ?? "",
      caption: caption ?? "",
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
    const getAllPost = await PostCollection.find().sort({ createdAt: -1 }).setOptions({ lean: true });
    return { posts: JSON.parse(JSON.stringify(getAllPost)) };
  } catch (err) {
    return { error: err.message };
  }
}

/** get post by ID */
async function getPostById(id: string) {
  try {
    await connectDB();
    const post = await PostCollection.findOne({ _id: id });
    return { post: JSON.parse(JSON.stringify(post)) };
  } catch (error) {
    return Promise.reject(error);
  }
}

async function updatePost(values: UpdatePostType) {
  try {
    const { _id, tags, caption, location } = values;
    const findPostToUpdate = await PostCollection.find({ _id });
    if (!findPostToUpdate) throw new Error("Couldn't found the post");

    findPostToUpdate[0].caption = caption;
    findPostToUpdate[0].tags = tags;
    findPostToUpdate[0].location = location;

    await findPostToUpdate[0].save();
    revalidatePath("/");
    return { post: JSON.parse(JSON.stringify(findPostToUpdate[0])) };
  } catch (error) {
    return Promise.reject(error);
  }
}
export { createPost, getAllPosts, getPostById, updatePost };
