"use server";

import connectDB from "@/src/lib/connectToMongodb";
import Post from "@/src/schema/postSchema";
import { PostTypeForCreatingPost, PostTypeRes, UpdatePostType } from "@/src/types/post";
import { revalidatePath } from "next/cache";
import getUserDetails from "../lib/getUserDetails";

/** create post */
async function createPost(values: PostTypeForCreatingPost) {
  try {
    await connectDB();
    const { file, userId, tags, caption, location, createdAt, userAvatar } = values;
    if (!file) throw new Error("Image is Missiing");

    const postCreated = new Post({
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
    revalidatePath("/explore");
    return { post: JSON.parse(JSON.stringify(postCreated)) };
  } catch (error) {
    const e = error instanceof Error ? error : new Error("Something went wrong");
    return { error: e.message };
  }
}

/** get All post */
async function getAllPosts(): Promise<PostTypeRes> {
  try {
    await connectDB();
    const getAllPost = await Post.find().sort({ createdAt: -1 }).setOptions({ lean: true });
    return { posts: JSON.parse(JSON.stringify(getAllPost)) };
  } catch (error) {
    const e = error instanceof Error ? error : new Error("Something went wrong");
    return { error: e.message };
  }
}

/** get post by ID */
async function getPostById(id: string) {
  try {
    await connectDB();
    const post = await Post.findOne({ _id: id });
    return { post: JSON.parse(JSON.stringify(post)) };
  } catch (error) {
    const e = error instanceof Error ? error : new Error("Something went wrong");
    return { error: e.message };
  }
}

async function updatePost(values: UpdatePostType) {
  try {
    const { _id, tags, caption, location } = values;
    const findPostToUpdate = await Post.find({ _id });
    if (!findPostToUpdate) throw new Error("Couldn't found the post");
    const { userId } = getUserDetails();

    findPostToUpdate[0].caption = caption;
    findPostToUpdate[0].tags = tags;
    findPostToUpdate[0].location = location;

    await findPostToUpdate[0].save();
    revalidatePath("/");
    revalidatePath("/explore");
    revalidatePath("/saved");
    revalidatePath("/profile/" + userId);
    return { post: JSON.parse(JSON.stringify(findPostToUpdate[0])) };
  } catch (error) {
    const e = error instanceof Error ? error : new Error("Something went wrong");
    return { error: e.message };
  }
}

async function deletePost(values: { _id: string }) {
  try {
    const { _id } = values;
    const deletedPost = await Post.findOneAndDelete({ _id });
    if (!deletedPost) throw new Error("Couldn't found the post");
    revalidatePath("/");
    revalidatePath("/explore");
    // redirect("/");
    return { post: JSON.parse(JSON.stringify(deletedPost)) };
  } catch (error) {
    const e = error instanceof Error ? error : new Error("Something went wrong");
    return { error: e.message };
  }
}

/** get user all posts */
async function getUserPosts(id: string) {
  try {
    await connectDB();
    const getUserPosts = await Post.find({ userId: id }).sort({ createdAt: -1 }).setOptions({ lean: true });
    return { posts: JSON.parse(JSON.stringify(getUserPosts)) };
  } catch (error) {
    const e = error instanceof Error ? error : new Error("Something went wrong");

    return { error: e.message };
  }
}
export { createPost, deletePost, getAllPosts, getPostById, getUserPosts, updatePost };