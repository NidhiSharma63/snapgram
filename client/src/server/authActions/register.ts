"use server";

import connectDB from "@/src/lib/connectToMongodb";
import User from "@/src/schema/userSchema";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

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

    const user = new User({
      email,
      username,
      password: hashPassword,
      avatar: "",
      bio,
    });

    // before saving the user create the token
    await user.generateAuthToken(uniqueBrowserId);

    // create user
    const createdUser = await user.save();
    // cookies().set()
    cookies().set({
      name: "userId",
      value: createdUser._id.toString(),
      httpOnly: true,
      path: "/",
      maxAge: 50000,
      secure: true,
      sameSite: "strict",
    });
    cookies().set({
      name: "token",
      value: createdUser.tokens[0].token.toString(),
      httpOnly: true,
      path: "/",
      maxAge: 50000,
      secure: true,
      sameSite: "strict",
    });

    cookies().set({
      name: "browserId",
      value: createdUser.tokens[0].uniqueBrowserId.toString(),
      httpOnly: true,
      path: "/",
      maxAge: 50000,
      secure: true,
      sameSite: "strict",
    });
    return { createdUser: JSON.parse(JSON.stringify(createdUser)) };
  } catch (err) {
    return { error: err.message };
  }
}

export default registerUser;

// "use server";

// import clientPromise from "@/src/lib/connectToMongodb";
// import dbName from "@/src/lib/dbName";
// import User from "@/src/schema/userSchema";
// import bcrypt from "bcrypt";
// import { cookies } from "next/headers";

// type registerValues = {
//   email: string;
//   password: string;
//   avatar: string | null;
//   bio: string;
//   username: string;
//   uniqueBrowserId: string;
// };

// type RegisterResponse = {
//   createdUser?: {
//     email: string;
//     password: string;
//     username: string;
//     avatar: string;
//     tokens: { token: string; uniqueBrowserId: string }[];
//     bio: string;
//     _id: string;
//   };
//   error?: string;
// };
// async function registerUser(values: registerValues): Promise<RegisterResponse> {
//   // console.log("i call all the time");
//   try {
//     const client = await clientPromise;
//     const db = client.db(dbName);
//     const { email, password, bio, username, uniqueBrowserId } = values;

//     // check if any field is missing or not
//     if (!email || !password || !email.trim() || !password.trim()) {
//       throw new Error("Missing email or password");
//     }

//     /**
//      * check if email is already present to not
//      */

//     const isAlreadyPresentEmail = await db.collection(dbName).find({ email }).toArray();
//     if (isAlreadyPresentEmail.length > 0) {
//       throw new Error("Email is already exists");
//     }

//     /**
//      * check if username is present
//      */
//     const isUserNamePresent = await db.collection(dbName).find({ username }).toArray();
//     if (isUserNamePresent.length > 0) {
//       throw new Error("Username is already exists");
//     }

//     /**
//      * check if id present or not
//      */
//     if (!uniqueBrowserId) throw new Error("uniqueBrowserId is Missing");

//     // generate hash password with round 10
//     const hashPassword = await bcrypt.hash(password, 10);

//     const response = await db.collection(dbName).insertOne(document);
//     const user = new User({
//       email,
//       username,
//       password: hashPassword,
//       avatar: "",
//       bio,
//     });

//     // before saving the user create the token
//     await user.generateAuthToken(uniqueBrowserId);

//     // create user
//     const createdUser = await user.save();
//     // cookies().set()
//     cookies().set({
//       name: "userId",
//       value: createdUser._id.toString(),
//       httpOnly: true,
//       path: "/",
//       maxAge: 50,
//       secure: true,
//       sameSite: "strict",
//     });
//     cookies().set({
//       name: "token",
//       value: createdUser.tokens[0].token.toString(),
//       httpOnly: true,
//       path: "/",
//       maxAge: 50,
//       secure: true,
//       sameSite: "strict",
//     });

//     cookies().set({
//       name: "browserId",
//       value: createdUser.tokens[0].uniqueBrowserId.toString(),
//       httpOnly: true,
//       path: "/",
//       maxAge: 50,
//       secure: true,
//       sameSite: "strict",
//     });
//     return { createdUser: JSON.parse(JSON.stringify(createdUser)) };
//   } catch (err) {
//     return { error: err.message };
//   }
// }

// export default registerUser;
