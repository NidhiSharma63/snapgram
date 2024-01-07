import { addUser, loginUser, logoutUser } from "./mutations/authUser";

// Provide resolver functions for your schema fields
export const resolvers = {
	Mutation: {
		addUser,
		logoutUser,
		loginUser,
	},
};
