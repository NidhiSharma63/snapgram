"use server";

import connectDB from "@/src/lib/connectToMongodb";
import Save from "@/src/schema/saveSchema";
import { revalidatePath } from "next/cache";

async function addSaves(values: { userId: string; postId: string }) {
  try {
    await connectDB();
    const { userId, postId } = values;
    if (!postId) throw new Error("Post id is Missiing");
    if (!userId) throw new Error("User id is Missiing");

    const isAlreadyPresentPost = await Save.findOne({ userId });
    if (isAlreadyPresentPost) {
      isAlreadyPresentPost.postId.push(postId);
      await isAlreadyPresentPost.save();
      revalidatePath("/saved");
      return { res: JSON.parse(JSON.stringify(isAlreadyPresentPost)) };
    } else {
      const createNewLikesObj = new Save({
        postId,
        userId,
      });
      await createNewLikesObj.save();
      revalidatePath("/saved");
      return { res: JSON.parse(JSON.stringify(createNewLikesObj)) };
    }
    // revalidatePath("/");
  } catch (error) {
    const e = error instanceof Error ? error : new Error("Something went wrong");
    return { error: e.message };
  }
}

async function removeSaves(values: { userId: string; postId: string }) {
  try {
    const { userId, postId: postIdToRemove } = values;

    if (!postIdToRemove) throw new Error("Post id is Missiing");
    if (!userId) throw new Error("User id is Missiing");

    const updateLikesInPost = await Save.findOneAndUpdate(
      { userId },
      { $pull: { postId: postIdToRemove } },
      { new: true }
    );

    console.log({ updateLikesInPost });
    revalidatePath("/saved");
    return { res: JSON.parse(JSON.stringify(updateLikesInPost)) };
  } catch (error) {
    const e = error instanceof Error ? error : new Error("Something went wrong");
    return { error: e.message };
  }
}

async function getAllSavePost(id: string) {
  try {
    if (!id) throw new Error("User id is Missiing");

    const allSavePost = await Save.find({ userId: id }).setOptions({ lean: true });
    return { posts: JSON.parse(JSON.stringify(allSavePost)) };
  } catch (error) {
    const e = error instanceof Error ? error : new Error("Something went wrong");
    return { error: e.message };
  }
}

export { addSaves, getAllSavePost, removeSaves };
