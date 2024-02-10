"use server";

import connectDB from "@/src/lib/connectToMongodb";
import Save from "@/src/schema/saveSchema";

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
      return { res: JSON.parse(JSON.stringify(isAlreadyPresentPost)) };
    } else {
      const createNewLikesObj = new Save({
        postId,
        userId,
      });
      await createNewLikesObj.save();
      return { res: JSON.parse(JSON.stringify(createNewLikesObj)) };
    }
    // revalidatePath("/");
  } catch (error) {
    console.log("Error in savePost:", error);
    return Promise.reject(error);
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
    return { res: JSON.parse(JSON.stringify(updateLikesInPost)) };
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getAllSavePost(id: string) {
  try {
    if (!id) throw new Error("User id is Missiing");

    const allSavePost = await Save.find({ userId: id }).setOptions({ lean: true });
    return { posts: JSON.parse(JSON.stringify(allSavePost)) };
  } catch (error) {
    return Promise.reject(error);
  }
}

export { addSaves, getAllSavePost, removeSaves };
