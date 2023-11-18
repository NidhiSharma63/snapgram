const bcrypt = require("bcrypt");
import { NextFunction, Request, Response } from "express";
import User from "../models/userSchema";

// register
const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, avtar, bio, username, uniqueBrowserId } = req.body;

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
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// login user
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, uniqueBrowserId } = req.body;

    // check if user already register or not because only register user can log in
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid login detail");
    }

    if (!uniqueBrowserId) throw new Error("uniqueBrowserId is Missing");
    // check if provided password by user is same as stored in data
    const getPassword = user.password;

    // verify password first pass user created password and then pass stored password
    const verifyPassword = await bcrypt.compare(password, getPassword);

    if (!verifyPassword) {
      throw new Error("Invalid login detail");
    }

    // generate token once user have correct credentials
    await user.generateAuthToken(uniqueBrowserId);

    // filter out all the tokens and send the current token only
    const updatedUserWithToken = user.tokens.filter((item) => item.uniqueBrowserId === uniqueBrowserId);
    user.tokens = updatedUserWithToken;
    // is all okay send user data back
    if (user) {
      res.status(201).json(user);
    }
  } catch (error) {
    next(error);
  }
};

// logout page
const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, token } = req.body;

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
    res.status(202).json({ message: "successfully logged out" });
  } catch (error) {
    next(error);
  }
};

/**
 * get user by id
 */

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.query;
  try {
    let getUser = await User.findOne({ _id: id });
    res.status(200).json(getUser);
  } catch (error) {
    next(error);
  }
};

/**
 * update user
 */

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { _id, avatar, username } = req.body;
  try {
    let getUser = await User.findOne({ _id });
    /**
     * check if username is present
     */
    const isUserNamePresent = await User.find({ username });
    if (isUserNamePresent.length > 0) {
      throw new Error("Username is already exists");
    }
    /** update user */
    if (getUser) {
      getUser.username = username;
      getUser.avatar = avatar;
    }
    res.status(200).json(getUser);
  } catch (error) {
    next(error);
  }
};
export { getUser, loginUser, logout, registerUser, updateUser };
