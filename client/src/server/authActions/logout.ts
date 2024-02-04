"use server";

import connectDB from "@/src/lib/connectToMongodb";
import getUserDetails from "@/src/lib/getUserDetails";
import User from "@/src/schema/userSchema";
import { cookies } from "next/headers";

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
    const getUserFromDB = await User.findOne({ _id: userId?.value });

    if (!getUserFromDB) {
      throw new Error("User not found");
    }

    // updating token
    const updatedToken = getUserFromDB.tokens.filter((item) => item.token !== token?.value);
    getUserFromDB.tokens = updatedToken;
    // saving user to database after updatig the token
    await getUserFromDB.save();

    cookies().set({
      name: "userId",
      value: "",
      httpOnly: true,
      path: "/",
      maxAge: 0,
      secure: true,
      sameSite: "strict",
    });

    cookies().set({
      name: "token",
      value: "",
      httpOnly: true,
      path: "/",
      maxAge: 0,
      secure: true,
      sameSite: "strict",
    });

    cookies().set({
      name: "browserId",
      value: "",
      httpOnly: true,
      path: "/",
      maxAge: 0,
      secure: true,
      sameSite: "strict",
    });
    return { message: "successfully logged out" };
  } catch (error) {
    return { error: error.message };
  }
};

export default logout;
