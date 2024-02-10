import Like from "@/src/schema/likeSchema";
import postSchema from "@/src/schema/postSchema";

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

async function addLike(values: { userId: string; postId: string }) {
  try {
    const { userId, postId } = values;

    if (!postId) throw new Error("Post id is Missiing");
    if (!userId) throw new Error("User id is Missiing");
    const paramsToAddLikeToPost = { userId, postId };
    const isAlreadyPresentPost = await Like.findOne({ userId });

    if (isAlreadyPresentPost) {
      isAlreadyPresentPost.postId.push(postId);
      await isAlreadyPresentPost.save();
      await addLikeToPost(paramsToAddLikeToPost);
      return { res: JSON.parse(JSON.stringify(isAlreadyPresentPost)) };
    } else {
      const createNewLikesObj = new Like({
        postId,
        userId,
      });
      await createNewLikesObj.save();
      await addLikeToPost(paramsToAddLikeToPost);
      return { res: JSON.parse(JSON.stringify(createNewLikesObj)) };
    }
  } catch (error) {
    return Promise.reject(error);
  }
}

async function removeLike(values: { userId: string; postId: string }) {
  try {
    const { userId, postId } = values;
    const findPostToUpdate = await postSchema.findOne({ _id: postId });
    if (!findPostToUpdate) throw new Error("Couldn't found the post");

    // Use splice to remove userId from likes array
    const userIndex = findPostToUpdate.likes.indexOf(userId);
    if (userIndex !== -1) {
      findPostToUpdate.likes.splice(userIndex, 1);
    }
    await findPostToUpdate.save();
    return { res: JSON.parse(JSON.stringify(findPostToUpdate)) };
  } catch (error) {
    console.log("Error in removeLike:", error);
    return Promise.reject(error);
  }
}

export { addLike, removeLike };
