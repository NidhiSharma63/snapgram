"use server";

import connectDB from "@/src/lib/connectToMongodb";
import User, { type IUser } from "@/src/schema/userSchema";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import getUserDetails from "../lib/getUserDetails";

type loginValues = {
	email: string;
	password: string;
	uniqueBrowserId: string;
};

type registerValues = {
	email: string;
	password: string;
	avatar: string | null;
	bio: string;
	username: string;
	uniqueBrowserId: string;
};

type RegisterResponse = {
	createdUser?: {
		email: string;
		password: string;
		username: string;
		avatar: string;
		tokens: { token: string; uniqueBrowserId: string }[];
		bio: string;
		_id: string;
	};
	error?: string;
};
async function login(values: loginValues) {
	try {
		await connectDB();
		const { email, password, uniqueBrowserId } = values;

		const foundUser:IUser |null = await User.findOne({ email });
		if (!foundUser) {
			throw new Error("Invalid login detail");
		}

		if (!uniqueBrowserId) throw new Error("uniqueBrowserId is Missing");

		const getPassword = foundUser.password;
		const verifyPassword = await bcrypt.compare(password, getPassword);

		if (!verifyPassword) {
			throw new Error("Invalid login detail");
		}

		await foundUser.generateAuthToken(uniqueBrowserId);
		const updatedUserWithToken = foundUser.tokens.filter(
			(item) => item.uniqueBrowserId === uniqueBrowserId,
		);
		foundUser.tokens = updatedUserWithToken;

		cookies().set({
			name: "userId",
			value: foundUser._id.toString() as string,
			httpOnly: true,
			path: "/",
			maxAge: 2592000, // 30 days in seconds,
			secure: true,
			sameSite: "strict",
		});
		cookies().set({
			name: "token",
			value: foundUser.tokens[0].token.toString(),
			httpOnly: true,
			path: "/",
			maxAge: 2592000, // 30 days in seconds,
			secure: true,
			sameSite: "strict",
		});

		cookies().set({
			name: "browserId",
			value: foundUser.tokens[0].uniqueBrowserId.toString(),
			httpOnly: true,
			path: "/",
			maxAge: 2592000, // 30 days in seconds,
			secure: true,
			sameSite: "strict",
		});

		return {
			user: JSON.parse(JSON.stringify(foundUser)),
		};
	} catch (error) {
		const e =
			error instanceof Error ? error : new Error("Something went wrong");
		return { error: e.message };
	}
}

const logout = async () => {
	try {
		await connectDB();
		const { userId, token } = getUserDetails();

		if (!userId?.value) {
			throw new Error("UserId is Missing");
		}
		if (!token?.value) {
			throw new Error("Token is Missing");
		}
		// console.log(userId?.value);
		const getUserFromDB = await User.findOne({ _id: userId?.value });

		if (!getUserFromDB) {
			throw new Error("User not found");
		}

		// updating token
		const updatedToken = getUserFromDB.tokens.filter(
			(item) => item.token !== token?.value,
		);
		getUserFromDB.tokens = updatedToken;
		// saving user to database after updatig the token
		await getUserFromDB.save();

		cookies().delete("userId");
		cookies().delete("token");
		cookies().delete("browserId");
		return { message: "successfully logged out" };
	} catch (error) {
		const e =
			error instanceof Error ? error : new Error("Something went wrong");
		return { error: e.message };
	}
};

async function registerUser(values: registerValues): Promise<RegisterResponse> {
	// console.log("i call all the time");
	try {
		await connectDB();
		// const db = clientPromise.db("snapgramNextStaging");
		const { email, password, bio, username, uniqueBrowserId } = values;

		// check if any field is missing or not
		if (!email || !password || !email.trim() || !password.trim()) {
			throw new Error("Missing email or password");
		}

		/**
		 * check if email is already present to not
		 */

		const isAlreadyPresentEmail = await User.find({ email });
		if (isAlreadyPresentEmail.length > 0) {
			throw new Error("Email is already exists");
		}

		/**
		 * check if username is present
		 */
		const isUserNamePresent = await User.find({ username });
		if (isUserNamePresent.length > 0) {
			throw new Error("Username is already exists");
		}

		/**
		 * check if id present or not
		 */
		if (!uniqueBrowserId) throw new Error("uniqueBrowserId is Missing");

		// generate hash password with round 10
		const hashPassword = await bcrypt.hash(password, 10);

		const user: IUser = new User({
			email,
			username,
			password: hashPassword,
			avatar: "",
			bio,
		});

		// before saving the user create the token
		await user.generateAuthToken(uniqueBrowserId);

		// create user
		const createdUser: IUser = await user.save();
		// cookies().set()
		cookies().set({
			name: "userId",
			value: createdUser._id.toString(),
			httpOnly: true,
			path: "/",
			maxAge: 2592000, // 30 days in seconds,
			secure: true,
			sameSite: "strict",
		});
		cookies().set({
			name: "token",
			value: createdUser.tokens[0].token.toString(),
			httpOnly: true,
			path: "/",
			maxAge: 2592000, // 30 days in seconds,
			secure: true,
			sameSite: "strict",
		});

		cookies().set({
			name: "browserId",
			value: createdUser.tokens[0].uniqueBrowserId.toString(),
			httpOnly: true,
			path: "/",
			maxAge: 2592000, // 30 days in seconds,
			secure: true,
			sameSite: "strict",
		});
		return { createdUser: JSON.parse(JSON.stringify(createdUser)) };
	} catch (error) {
		const e =
			error instanceof Error ? error : new Error("Something went wrong");
		return { error: e.message };
	}
}
export { login, logout, registerUser };
