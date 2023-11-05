const bcrypt = require("bcrypt");
import { NextFunction, Request, Response } from "express";
import User from "../models/userSchema";

// register
const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, avtar, bio, username } = req.body;

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

    // generate hash password with round 10
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      username,
      password: hashPassword,
      avtar,
      bio,
    });

    // before saving the user create the token
    await user.generateAuthToken();

    // create user
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// login user
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // check if user already register or not because only register user can log in
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid login detail");
    }
    // check if provided password by user is same as stored in data
    const getPassword = user.password;

    // verify password first pass user created password and then pass stored password
    const verifyPassword = await bcrypt.compare(password, getPassword);

    if (!verifyPassword) {
      throw new Error("Invalid login detail");
    }

    // generate token once user have correct credentials
    const token = await user.generateAuthToken();

    // setting token as a cookie
    // res.cookie("Todo", token, { httpOnly: true, secure: true });

    // is all okay send user back data
    if (user) {
      res.status(201).json({ user, token });
    } else {
      throw new Error("Server Error");
    }
  } catch (error) {
    next(error);
  }
};

// logout page
const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req?.body?.userId;
    const getUserFromDB = await User.findOne({ _id: userId });
    if (getUserFromDB) {
      // updating token
      // getUserFromDB.token = "";

      // saving user to database after updatig the token
      await getUserFromDB.save();
    }
    res.status(202).json({ message: "successfully logged out" });
  } catch (error) {
    next(error);
  }
};
export { loginUser, logout, registerUser };
