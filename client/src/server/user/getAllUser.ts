"use server";

import connectDB from "@/src/lib/connectToMongodb";
import User from "@/src/schema/userSchema";
import { UserTypeArray } from "@/src/types/user";

async function getAllUser(): Promise<UserTypeArray> {
  try {
    await connectDB();
    const getUsersFromDB = await User.find();
    return { users: JSON.parse(JSON.stringify(getUsersFromDB)) };
  } catch (err) {
    return { error: err.message };
  }
}

export default getAllUser;
