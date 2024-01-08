import { dateScalar } from "./dateResolver";
import { addUser, loginUser, logoutUser } from "./mutations/authUser";
import { createPost, deletePost, getAllPost, getPostById, updatePost } from "./mutations/post";

// Provide resolver functions for your schema fields
export const resolvers = {
	Date: dateScalar,
	Query: {
		getAllPost,
		getPostById,
	},
	Mutation: {
		addUser,
		logoutUser,
		loginUser,
		createPost,
		updatePost,
		deletePost,
	},
};
