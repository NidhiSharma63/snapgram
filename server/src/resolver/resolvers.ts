import bcrypt from "bcrypt";
import { GraphQLError } from "graphql";
import User from "../models/userSchema";

// Provide resolver functions for your schema fields
interface AddUserInput {
	email: string;
	password: string;
	username: string;
	avatar: string;
	bio: string;
	uniqueBrowserId: string;
}
export const resolvers = {
	Mutation: {
		addUser: async (_: any, args: { userInput: AddUserInput }) => {
			const userDetails = args.userInput;
			const { email, password, avatar, bio, username, uniqueBrowserId } = userDetails;

			// check if any field is missing or not
			if (!email || !password || !email.trim() || !password.trim()) throw new GraphQLError("Email is missing");

			if (!password || !password.trim()) throw new GraphQLError("Password is missing");

			if (!username) throw new GraphQLError("Username is missing");

			if (!uniqueBrowserId) throw new GraphQLError("uniqueBrowserId is Missing");

			/**
			 * check if email is already present or not
			 */
			const isAlreadyPresentEmail = await User.find({ email });
			if (isAlreadyPresentEmail.length > 0) throw new GraphQLError("Email is already exists");

			/**
			 * check if username is present
			 */
			const isUserNamePresent = await User.find({ username });
			if (isUserNamePresent.length > 0) {
				throw new Error("Username is already exists");
			}

			// generate hash password with round 10
			const hashPassword = await bcrypt.hash(password, 10);

			const user = new User({
				email,
				username,
				password: hashPassword,
				avatar,
				bio,
			});

			// before saving the user create the token
			await user.generateAuthToken(uniqueBrowserId);
			// create user
			await user.save();
			return user;
		},
	},
};
