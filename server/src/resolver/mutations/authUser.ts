import bcrypt from "bcrypt";
import { GraphQLError } from "graphql";
import User from "../../models/userSchema";
import isValidObjectId from "../../utils/checkUserIsValid";
// import throwError from "../../utils/throwError";
import { handleGraphQLError, throwError } from "../../middleware/ErrorHandler";

interface AddUserInput {
	email: string;
	password: string;
	username: string;
	avatar: string;
	bio: string;
	uniqueBrowserId: string;
}

interface LoginUserInput {
	email: string;
	password: string;
	uniqueBrowserId: string;
}

interface LogoutUser {
	userId: string;
	token: string;
}

async function addUser(_: any, args: { userInput: AddUserInput }) {
	try {
		const userDetails = args.userInput;
		const { email, password, avatar, bio, username, uniqueBrowserId } = userDetails;

		// check if any field is missing or not
		if (!email || !password || !email.trim() || !password.trim()) throw new GraphQLError("Email is missing");

		if (!password || !password.trim()) throwError("Password is missing");

		if (!username) throwError("Username is missing");

		if (!uniqueBrowserId) throwError("uniqueBrowserId is Missing");

		/**
		 * check if email is already present or not
		 */
		const isAlreadyPresentEmail = await User.find({ email });
		if (isAlreadyPresentEmail.length > 0) throwError("Email is already exists");

		/**
		 * check if username is present
		 */
		const isUserNamePresent = await User.find({ username });
		if (isUserNamePresent.length > 0) {
			throwError("Username is already exists");
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
	} catch (error) {
		if (error instanceof Error) handleGraphQLError(error);
	}
}

async function loginUser(_: any, args: { userInput: LoginUserInput }) {
	try {
		const { userInput } = args;
		const { email, password, uniqueBrowserId } = userInput;

		// check if user already register or not because only register user can log in
		const user = await User.findOne({ email });
		if (!user) throwError("Invalid login detail");
		if (!uniqueBrowserId) throwError("uniqueBrowserId is Missing");
		if (!password || !email) throwError("Email or password is Missing");

		// check if provided password by user is same as stored in data
		const getPassword = user.password;
		// verify password first pass user created password and then pass stored password
		const verifyPassword = await bcrypt.compare(password, getPassword);

		if (!verifyPassword) throwError("Invalid login detail");

		// generate token once user have correct credentials
		await user.generateAuthToken(uniqueBrowserId);

		// filter out all the tokens and send the current token only
		const updatedUserWithToken = user.tokens.filter((item) => item.uniqueBrowserId === uniqueBrowserId);
		user.tokens = updatedUserWithToken;
		// is all okay send user data back
		return user;
	} catch (error) {
		if (error instanceof Error) handleGraphQLError(error);
	}
}

async function logoutUser(_: any, args: { userInput: LogoutUser }) {
	try {
		const { userId, token } = args.userInput;

		// Input Validation
		if (!userId || !token) {
			throwError(`${!userId ? "UserId" : "Token"} is missing`);
		}
		// Validate ObjectId
		if (!isValidObjectId(userId)) {
			throwError("User id is not valid");
		}

		const getUserFromDB = await User.findOne({ _id: userId });
		if (!getUserFromDB) {
			throwError("Invalid details");
		}
		// updating token
		const updatedToken = getUserFromDB.tokens.filter((item) => item.token !== token);
		getUserFromDB.tokens = updatedToken;
		// saving user to database after updating the token
		await getUserFromDB.save();
		return "successfully logged out";
	} catch (error) {
		// Handle unexpected server-side errors
		if (error instanceof Error) handleGraphQLError(error);
	}
}

export { addUser, loginUser, logoutUser };
