"use server";

import connectDB from "@/src/lib/connectToMongodb";
import getUserDetails from "@/src/lib/getUserDetails";
import User from "@/src/schema/userSchema";
import { UserType, UserTypeArray } from "@/src/types/user";

async function getAllUser(): Promise<UserTypeArray> {
  try {
    await connectDB();
    const getUsersFromDB = await User.find();
    return { users: JSON.parse(JSON.stringify(getUsersFromDB)) };
  } catch (err) {
    return { error: err.message };
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
    return { error: err.message };
  }
}

export { getActiveUserData, getAllUser };