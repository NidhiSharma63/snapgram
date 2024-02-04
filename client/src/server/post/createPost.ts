import Post from "@/src/schema/postSchema";
import { PostTypeForCreatingPost } from "@/src/types/post";

async function createPost(values: PostTypeForCreatingPost) {
  try {
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
    return { post: JSON.parse(JSON.stringify(postCreated)) };
  } catch (err) {
    return { error: err.message };
  }
}

export default createPost;
