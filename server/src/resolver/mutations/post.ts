import { handleGraphQLError, throwError } from "../../middleware/ErrorHandler";
import Post from "../../models/postSchema";

interface CreatePostInput {
	file: string;
	userId: string;
	tags: string[];
	location: string[];
	caption: string[];
	createdAt: string;
	likes: string[];
}

interface UpdatePost {
	_id: string;
	tags: string[];
	caption: string[];
	location: string[];
}

async function createPost(_: any, args: { userInput: CreatePostInput }) {
	try {
		const userDetails = args.userInput;
		const { file, userId, tags, caption, location, createdAt } = userDetails;

		// check if any field is missing or not
		if (!file) throwError("Meadia is missing");
		if (!userId) throwError("UserId is missing");

		const postCreated = new Post({
			file,
			userId,
			tags: tags ?? [],
			location: location ?? [],
			caption: caption ?? [],
			createdAt,
			likes: [],
		});
		await postCreated.save();
		return postCreated;
	} catch (error) {
		if (error instanceof Error) handleGraphQLError(error);
	}
}

async function updatePost(_: any, args: { userInput: UpdatePost }) {
	try {
		const { userInput } = args;
		const { _id, tags, caption, location } = userInput;
		let findPostToUpdate = await Post.find({ _id });
		if (findPostToUpdate.length === 0) throwError("Couldn't found the post");
		console.log(findPostToUpdate);
		findPostToUpdate[0].caption = caption;
		findPostToUpdate[0].tags = tags;
		findPostToUpdate[0].location = location;

		await findPostToUpdate[0].save();
		return findPostToUpdate[0];
	} catch (error) {
		if (error instanceof Error) handleGraphQLError(error);
	}
}

async function deletePost(_: any, args: { _id: string }) {
	try {
		const { _id } = args;
		let findPostToDelete = await Post.findOneAndDelete({ _id });
		if (!findPostToDelete) throwError("Couldn't found the post");
		return findPostToDelete;
	} catch (error) {
		if (error instanceof Error) handleGraphQLError(error);
	}
}

async function getAllPost() {
	try {
		let getAllPost = await Post.find().sort({ createdAt: -1 }).setOptions({ lean: true });
		return getAllPost;
	} catch (error) {
		if (error instanceof Error) handleGraphQLError(error);
	}
}

async function getPostById(_: any, args: { _id: string }) {
	try {
		const { _id } = args;
		let getOnePost = await Post.findOne({ _id }).setOptions({ lean: true });
		return getOnePost;
	} catch (error) {
		if (error instanceof Error) handleGraphQLError(error);
	}
}
export { createPost, deletePost, getAllPost, getPostById, updatePost };
