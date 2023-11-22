import Post from "../models/postSchema";

async function addLikeToPost(params: { userId: string; postId: string }) {
  try {
    const { userId, postId } = params;
    let findPostToUpdate = await Post.findOne({ _id: postId });
    if (!findPostToUpdate) throw new Error("Couldn't found the post");

    // Use splice to remove userId from likes array
    findPostToUpdate.likes.push(userId);

    await findPostToUpdate.save();
  } catch (error) {
    console.log("Error in addLike:", error);
    throw error;
  }
}

async function removeLikeFromPost(params: { userId: string; postId: string }) {
  try {
    const { userId, postId } = params;
    let findPostToUpdate = await Post.findOne({ _id: postId });
    if (!findPostToUpdate) throw new Error("Couldn't found the post");

    // Use splice to remove userId from likes array
    const userIndex = findPostToUpdate.likes.indexOf(userId);
    if (userIndex !== -1) {
      findPostToUpdate.likes.splice(userIndex, 1);
    }
    await findPostToUpdate.save();
  } catch (error) {
    console.log("Error in addLike:", error);
    throw error;
  }
}

export { addLikeToPost, removeLikeFromPost };
