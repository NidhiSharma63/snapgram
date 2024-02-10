"use server";

import connectDB from "@/src/lib/connectToMongodb";
import getUserDetails from "@/src/lib/getUserDetails";
import User from "@/src/schema/userSchema";
import { UserType, UserTypeArray, UserUpdateProfileValues } from "@/src/types/user";
import { revalidatePath } from "next/cache";

async function getAllUser(): Promise<UserTypeArray> {
  try {
    await connectDB();
    const getUsersFromDB = await User.find();
    return { users: JSON.parse(JSON.stringify(getUsersFromDB)) };
  } catch (err) {
    return Promise.reject(err);
  }
}

async function getActiveUserData(): Promise<UserType> {
  try {
    await connectDB();
    const { token, userId, uniqueBrowserId } = getUserDetails();
    const getUserDetailsFromDB = await User.findOne({ _id: userId?.value });

    const isValidTokenAndBrowserIdPresent = getUserDetailsFromDB?.tokens.filter(
      (item) => item.token === token?.value && item.uniqueBrowserId === uniqueBrowserId?.value
    );
    if (!getUserDetailsFromDB || !isValidTokenAndBrowserIdPresent) {
      throw new Error("User not found");
    }

    return { user: JSON.parse(JSON.stringify(getUserDetailsFromDB)) };
  } catch (err) {
    return Promise.reject(err);
  }
}
async function getUserById(_id: string) {
  try {
    await connectDB();
    const getUserDetailsFromDB = await User.findOne({ _id });
    if (!getUserDetailsFromDB) throw new Error("User not found");
    return { user: JSON.parse(JSON.stringify(getUserDetailsFromDB)) };
  } catch (err) {
    return Promise.reject(err);
  }
}

/** update profile */
async function updateProfile(values: UserUpdateProfileValues) {
  const { userId, file, username, bio } = values;
  try {
    const getUser = await User.findOne({ _id: userId });
    /**
     * check if username is present
     */
    const isUserNamePresent = await User.find({ username });

    if (isUserNamePresent.length > 0 && isUserNamePresent[0]._id.toString() !== userId) {
      throw new Error("Username is already exists");
    }
    /** update user */
    if (getUser) {
      getUser.username = username;
      getUser.avatar = file;
      getUser.bio = bio;
    }
    await getUser?.save();
    revalidatePath(`/profile/${userId}`);
    return { user: JSON.parse(JSON.stringify(getUser)) };
  } catch (error) {
    return Promise.reject(error);
  }
}

export { getActiveUserData, getAllUser, getUserById, updateProfile };
