"use server";

import getUserDetails from "@/src/lib/getUserDetails";
import User from "@/src/schema/userSchema";
import { UserType } from "@/src/types/user";

async function getUserData(): Promise<UserType> {
  try {
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

export default getUserData;
