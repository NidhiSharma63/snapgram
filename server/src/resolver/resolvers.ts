import { addUser, loginUser, logoutUser } from "./mutations/authUser";
import { createPost, deletePost, getAllPost, updatePost } from "./mutations/post";

// Provide resolver functions for your schema fields
export const resolvers = {
	Query: {
		getAllPost,
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
