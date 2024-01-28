"use server";

import User from "@/src/schema/userSchema";
import bcrypt from "bcrypt";
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

    return {
      user: foundUser,
    };
  } catch (error) {
    return { error: error.message };
  }
}
