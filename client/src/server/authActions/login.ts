"use server";

import User from "@/src/schema/userSchema";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
type loginValues = {
  email: string;
  password: string;
  uniqueBrowserId: string;
};

export async function login(values: loginValues) {
  try {
    const { email, password, uniqueBrowserId } = values;

    const foundUser = await User.findOne({ email });
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
    const updatedUserWithToken = foundUser.tokens.filter((item) => item.uniqueBrowserId === uniqueBrowserId);
    foundUser.tokens = updatedUserWithToken;

    cookies().set({
      name: "userId",
      value: foundUser._id.toString(),
      httpOnly: true,
      path: "/",
      maxAge: 5000,
      secure: true,
      sameSite: "strict",
    });
    cookies().set({
      name: "token",
      value: foundUser.tokens[0].token.toString(),
      httpOnly: true,
      path: "/",
      maxAge: 5000,
      secure: true,
      sameSite: "strict",
    });

    cookies().set({
      name: "browserId",
      value: foundUser.tokens[0].uniqueBrowserId.toString(),
      httpOnly: true,
      path: "/",
      maxAge: 50,
      secure: true,
      sameSite: "strict",
    });

    return {
      user: foundUser,
    };
  } catch (error: any) {
    return { error: error.message };
  }
}
