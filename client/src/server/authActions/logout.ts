"use server";

import User from "@/src/schema/userSchema";

type LogoutType = {
  userId: string;
  token: string;
};
const logout = async (values: LogoutType) => {
  try {
    const { userId, token } = values;

    if (!userId) {
      throw new Error("UserId is Missing");
    }
    if (!token) {
      throw new Error("Token is Missing");
    }
    const getUserFromDB = await User.findOne({ _id: userId });
    if (getUserFromDB) {
      // updating token
      const updatedToken = getUserFromDB.tokens.filter((item) => item.token !== token);
      getUserFromDB.tokens = updatedToken;
      // saving user to database after updatig the token
      await getUserFromDB.save();
    }
    return { message: "successfully logged out" };
  } catch (error) {
    return { error: error.message };
  }
};

export default logout;
