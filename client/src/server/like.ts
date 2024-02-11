"use server";

import connectDB from "@/src/lib/connectToMongodb";
import Like from "@/src/schema/likeSchema";
import postSchema from "@/src/schema/postSchema";
import { revalidatePath } from "next/cache";

async function addLikeToPost(params: { userId: string; postId: string }) {
  try {
    const { userId, postId } = params;
    const findPostToUpdate = await postSchema.findOne({ _id: postId });
    if (!findPostToUpdate) throw new Error("Couldn't found the post");

    // Use splice to remove userId from likes array
    findPostToUpdate.likes.push(userId);

    await findPostToUpdate.save();
  } catch (error) {
    console.log("Error in addLike:", error);
    return Promise.reject(error);
  }
}

async function removeLikeFromPost(params: { userId: string; postId: string }) {
  try {
    if (!params.postId) throw new Error("Post id is Missiing");
    if (!params.userId) throw new Error("User id is Missiing");
    const findPostToUpdate = await Like.findOne({ userId: params.userId });
    // console.log({findPostToUpdate})
    // Use splice to remove postId from likes array
    const postIndex = findPostToUpdate.postId.indexOf(params.postId);
    if (postIndex !== -1) {
      findPostToUpdate.postId.splice(postIndex, 1);
    }
    await findPostToUpdate.save();
    return { res: JSON.parse(JSON.stringify(findPostToUpdate)) };
  } catch (error) {
    console.log("Error in removeLike:", error);
    return Promise.reject(error);
  }
}

async function addLike(values: { userId: string; postId: string }) {
  try {
    await connectDB();
    const { userId, postId } = values;

    if (!postId) throw new Error("Post id is Missiing");
    if (!userId) throw new Error("User id is Missiing");
    const paramsToAddLikeToPost = { userId, postId };
    const isAlreadyPresentPost = await Like.findOne({ userId });

    if (isAlreadyPresentPost) {
      isAlreadyPresentPost.postId.push(postId);
      await isAlreadyPresentPost.save();
      await addLikeToPost(paramsToAddLikeToPost);
      revalidatePath(`/profile/${userId}`);
      return { res: JSON.parse(JSON.stringify(isAlreadyPresentPost)) };
    } else {
      const createNewLikesObj = new Like({
        postId,
        userId,
      });
      await createNewLikesObj.save();
      await addLikeToPost(paramsToAddLikeToPost);
      revalidatePath(`/profile/${userId}`);
      return { res: JSON.parse(JSON.stringify(createNewLikesObj)) };
    }
  } catch (error) {
    return Promise.reject(error);
  }
}

async function removeLike(values: { userId: string; postId: string }) {
  try {
    await connectDB();
    const { userId, postId } = values;
    // console.log({ postId }, "data removed");
    const findPostToUpdate = await postSchema.findOne({ _id: postId });
    if (!findPostToUpdate) throw new Error("Couldn't found the post");

    // Use splice to remove userId from likes array
    const userIndex = findPostToUpdate.likes.indexOf(userId);
    if (userIndex !== -1) {
      findPostToUpdate.likes.splice(userIndex, 1);
    }
    await findPostToUpdate.save();
    await removeLikeFromPost({ userId, postId });
    revalidatePath(`/profile/${userId}`);
    console.log("path revalidated ");
    return { res: JSON.parse(JSON.stringify(findPostToUpdate)) };
  } catch (error) {
    console.log("Error in removeLike:", error);
    return Promise.reject(error);
  }
}

async function getAllLikePost(id: string) {
  try {
    if (!id) throw new Error("User id is Missiing");

    const allLikePost = await Like.find({ userId: id }).setOptions({ lean: true });
    revalidatePath(`/profile/${id}`);
    // revalidatePath("/")
    return { posts: JSON.parse(JSON.stringify(allLikePost)) };
  } catch (error) {
    return Promise.reject(error);
  }
}

export { addLike, getAllLikePost, removeLike };
