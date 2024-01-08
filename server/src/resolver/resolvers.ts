import { addUser, loginUser, logoutUser } from "./mutations/authUser";
import { createPost, deletePost, updatePost } from "./mutations/post";

// Provide resolver functions for your schema fields
export const resolvers = {
	Mutation: {
		addUser,
		logoutUser,
		loginUser,
		createPost,
		updatePost,
		deletePost,
	},
};
